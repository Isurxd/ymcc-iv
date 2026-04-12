import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session_token');
    
    if (!sessionCookie) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const session = await decrypt(sessionCookie.value);
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { action } = await req.json(); // action can be 'APPROVE' or 'REJECT'
    const { id: paymentId } = await context.params;

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) return NextResponse.json({ message: 'Payment not found' }, { status: 404 });

    if (action === 'APPROVE') {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: paymentId },
          data: { verifiedAt: new Date() }
        }),
        prisma.registration.update({
          where: { id: payment.registrationId },
          data: { status: 'VERIFYING_DOCUMENT' } // Move to next stage
        })
      ]);
      return NextResponse.json({ message: 'Payment approved' });
    } else if (action === 'REJECT') {
      // For rejection, we'll delete the payment so they can upload again
      // and update registration status back to PENDING_PAYMENT
      await prisma.$transaction([
        prisma.payment.delete({
          where: { id: paymentId }
        }),
        prisma.registration.update({
          where: { id: payment.registrationId },
          data: { status: 'PENDING_PAYMENT' }
        })
      ]);
      return NextResponse.json({ message: 'Payment rejected' });
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
  }
}
