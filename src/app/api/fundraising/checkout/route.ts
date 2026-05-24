import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Xendit } from 'xendit-node';

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

    // 1. Calculate total order amount (Items + Shipping) - VALIDATED AGAINST DB
    let totalItemsAmount = 0;
    const verifiedItems = [];

    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true }
      });

      if (!variant) {
        return NextResponse.json({ message: `Varian produk ${item.variantId} tidak ditemukan` }, { status: 404 });
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json({ message: `Stok ${variant.product.name} tidak mencukupi` }, { status: 400 });
      }

      const itemPrice = variant.product.price; // Use price from DB
      totalItemsAmount += item.quantity * itemPrice;
      
      verifiedItems.push({
        variantId: item.variantId,
        quantity: item.quantity,
        priceAtBuy: itemPrice
      });
    }
    
    // Deduct stock in a follow-up transaction or directly
    await prisma.$transaction(
      verifiedItems.map(item => 
        prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } }
        })
      )
    );
    
    // Fallback shipping cost if not provided
    const finalShippingCost = shippingCost || 0;
    const finalTotalAmount = totalItemsAmount + finalShippingCost;

    // 2. Create Order in Database
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        shippingCourier,
        shippingCost: finalShippingCost,
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

    // 3. Create Xendit Invoice
    // Generate full URL for success/failure redirects based on current host
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
