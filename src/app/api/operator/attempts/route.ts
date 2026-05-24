import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRole } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await verifyRole(req, ['OPERATOR']);
    if (!session) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const attempts = await prisma.examAttempt.findMany({
      include: {
        registration: {
          include: {
            user: true
          }
        }
      },
      orderBy: { startTime: 'desc' }
    });

    return NextResponse.json(attempts);
  } catch (error) {
    console.error('Fetch Operator Attempts Error:', error);
    return NextResponse.json({ message: 'Error fetching attempts' }, { status: 500 });
  }
}
