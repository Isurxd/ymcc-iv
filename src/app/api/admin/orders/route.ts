import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRole } from '@/lib/auth';
import { decrypt } from '@/lib/encryption';

export async function GET(req: Request) {
  try {
    const session = await verifyRole(req, ['ADMIN', 'SUPERADMIN', 'FUNDRAISING']);
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

    // Decrypt sensitive phone numbers for authorized roles (Bab 1.1)
    const decryptedOrders = orders.map(order => ({
      ...order,
      customerPhone: decrypt(order.customerPhone)
    }));

    return NextResponse.json(decryptedOrders);
  } catch (error) {
    console.error('Fetch Orders API Error:', error);
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
  }
}
