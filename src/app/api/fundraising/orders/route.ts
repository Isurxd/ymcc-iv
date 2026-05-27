import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session_token');
    
    if (!sessionCookie) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const session = await decrypt(sessionCookie.value);
    if (!session || (session.role !== 'FUNDRAISING' && session.role !== 'ADMIN' && session.role !== 'SUPERADMIN')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
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
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Fundraising orders error:', error);
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
  }
}
