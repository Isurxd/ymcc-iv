import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRole } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await verifyRole(req, ['ADMIN']);
    if (!session) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { status, trackingNumber } = await req.json();

    const order = await prisma.order.update({
      where: { id: id },
      data: { 
        status,
        trackingNumber: trackingNumber || undefined
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Update Order API Error:', error);
    return NextResponse.json({ message: 'Error updating order' }, { status: 500 });
  }
}
