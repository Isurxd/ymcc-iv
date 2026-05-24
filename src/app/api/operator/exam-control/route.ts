import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { examId, action, liveStartedAt } = await req.json();

    if (!examId) return NextResponse.json({ message: 'Missing examId' }, { status: 400 });

    if (action === 'START') {
      await prisma.exam.update({
        where: { id: examId },
        data: {
          isLive: true,
          liveStartedAt: liveStartedAt || new Date()
        }
      });
    } else if (action === 'PAUSE' || action === 'STOP') {
      await prisma.exam.update({
        where: { id: examId },
        data: {
          isLive: false,
          liveStartedAt: null
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
