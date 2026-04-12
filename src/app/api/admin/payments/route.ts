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
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const payments = await prisma.payment.findMany({
      where: { verifiedAt: null },
      include: {
        registration: {
          include: {
            user: true,
            event: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Payments error:', error);
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
  }
}
