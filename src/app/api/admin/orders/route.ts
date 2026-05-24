import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRole } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await verifyRole(req, ['ADMIN']);
    if (!session) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Fetch Orders API Error:', error);
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
  }
}
