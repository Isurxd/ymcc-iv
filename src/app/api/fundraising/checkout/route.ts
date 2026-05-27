import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Xendit } from 'xendit-node';
import { encrypt } from '@/lib/encryption';

const xendit = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY || 'xnd_development_dummy',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      shippingAddress, 
      shippingCourier,
      shippingCost,
      items // Array of { variantId, quantity, priceAtBuy }
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'Keranjang kosong' }, { status: 400 });
    }

    // IMPLEMENT ACID TRANSACTION (Bab 3.1)
    const platformFee = 2500; // Flat Platform Fee as per Directive 3.2

    const result = await prisma.$transaction(async (tx) => {
      let currentTotalItemsAmount = 0;
      const verifiedItems = [];

      for (const item of items) {
        // Fetch with lock or inside transaction to ensure fresh stock data
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true }
        });

        if (!variant) {
          throw new Error(`Varian produk ${item.variantId} tidak ditemukan`);
        }

        if (variant.stock < item.quantity) {
          throw new Error(`Stok ${variant.product.name} tidak mencukupi (Tersisa: ${variant.stock})`);
        }

        // Deduct stock immediately in this transaction
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } }
        });

        const itemPrice = variant.product.price;
        currentTotalItemsAmount += item.quantity * itemPrice;
        
        verifiedItems.push({
          variantId: item.variantId,
          quantity: item.quantity,
          priceAtBuy: itemPrice
        });
      }

      const finalShippingCost = shippingCost || 0;
      const finalTotalAmount = currentTotalItemsAmount + finalShippingCost + platformFee;

      // Create Order
      const order = await tx.order.create({
        data: {
          customerName,
          customerEmail,
          customerPhone: encrypt(customerPhone), // ENCRYPT SENSITIVE DATA (Bab 1.1)
          shippingAddress,
          shippingCourier,
          shippingCost: finalShippingCost,
          platformFee: platformFee,
          totalAmount: finalTotalAmount,
          status: 'PENDING_PAYMENT',
          items: {
            create: verifiedItems.map((item: any) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              priceAtBuy: item.priceAtBuy,
            })),
          },
        },
      });

      return { order, finalTotalAmount };
    });

    const { order, finalTotalAmount } = result;

    // 3. Create Xendit Invoice
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const invoiceRequest: any = {
      externalId: order.id,
      amount: finalTotalAmount,
      payerEmail: customerEmail,
      description: `YMCC VII Merchandise Order #${order.id}`,
      currency: 'IDR',
      customer: {
        givenNames: customerName,
        email: customerEmail,
        mobileNumber: customerPhone,
      },
      successRedirectUrl: `${origin}/dashboard/orders?status=success`,
      failureRedirectUrl: `${origin}/dashboard/orders?status=failed`,
      invoiceDuration: 86400, // 24 hours
    };

    const invoice = await xendit.Invoice.createInvoice({ data: invoiceRequest });

    // 4. Update Order with Xendit Invoice ID and Payment URL
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        xenditInvoiceId: invoice.id,
        paymentUrl: invoice.invoiceUrl,
      },
    });

    return NextResponse.json({
      message: 'Checkout berhasil',
      order: updatedOrder,
      paymentUrl: invoice.invoiceUrl
    });

  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ 
      message: 'Terjadi kesalahan sistem saat checkout', 
      error: error.message 
    }, { status: 500 });
  }
}
