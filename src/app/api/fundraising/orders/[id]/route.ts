import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const orderId = (await params).id;
    
    // Auth Check
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session_token');
    
    if (!sessionCookie) return NextResponse.redirect(new URL('/login', req.url));

    const session = await decrypt(sessionCookie.value);
    // Note: in a real app, verify role === 'FUNDRAISING' or 'ADMIN'
    if (!session || !session.sub) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const formData = await req.formData();
    const status = formData.get('status') as string;

    if (!status) {
      return NextResponse.json({ message: 'Status is required' }, { status: 400 });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: status as any } // Cast to any to bypass exact enum type check
    });

    return NextResponse.redirect(new URL('/fundraising', req.url));

  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
