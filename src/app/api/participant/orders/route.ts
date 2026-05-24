import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await decrypt(sessionToken);
    if (!payload) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // We fetch current user first to get their email
    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Find orders where customerEmail matches user's email
    const orders = await prisma.order.findMany({
      where: { customerEmail: user.email },
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
    console.error('Fetch Participant Orders Error:', error);
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
  }
}
