import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const totalAmount = parseFloat(formData.get('total') as string);
    const proofFile = formData.get('proof') as File | null;
    const itemsRaw = formData.get('items') as string;

    if (!name || !email || !phone || !address || !itemsRaw || !proofFile) {
      return NextResponse.json({ message: 'Semua field wajib diisi' }, { status: 400 });
    }

    const items = JSON.parse(itemsRaw) as { variantId: string, quantity: number, price: number }[];
    if (items.length === 0) {
      return NextResponse.json({ message: 'Keranjang kosong' }, { status: 400 });
    }

    // 1. Transaction to verify stock and deduct
    const result = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId }
        });

        if (!variant || variant.stock < item.quantity) {
          throw new Error(`Stok tidak mencukupi untuk varian ID ${item.variantId}`);
        }

        // Deduct stock
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // 2. Save proof file
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (e) { }

      const bytes = await proofFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `receipt-${Date.now()}-${proofFile.name.replace(/\s+/g, '_')}`;
      const filepath = path.join(uploadsDir, filename);
      await writeFile(filepath, buffer);
      const proofUrl = `/uploads/receipts/${filename}`;

      // 3. Create Order
      const newOrder = await tx.order.create({
        data: {
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          shippingAddress: address,
          totalAmount: totalAmount,
          receiptUrl: proofUrl,
          status: 'PENDING_PAYMENT', // Admin has to verify proof
          items: {
            create: items.map(i => ({
              variantId: i.variantId,
              quantity: i.quantity,
              priceAtBuy: i.price,
            }))
          }
        }
      });

      return newOrder;
    });

    return NextResponse.json({ message: 'Order berhasil dibuat', orderId: result.id }, { status: 201 });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
