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

    const totalTeams = await prisma.registration.count();
    const pendingPayments = await prisma.payment.count({ where: { verifiedAt: null } });
    const pendingDocuments = await prisma.document.count({ where: { isVerified: false } });
    const verifiedTeams = await prisma.registration.count({ where: { status: 'VERIFIED' } });

    return NextResponse.json({
      totalTeams,
      pendingPayments,
      pendingDocuments,
      verifiedTeams
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
  }
}
