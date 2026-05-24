import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ message: 'Missing ID' }, { status: 400 });

    const exam = await prisma.exam.findUnique({
      where: { id },
      select: {
        isLive: true,
        liveStartedAt: true,
        durationMin: true,
        activeQuestionId: true
      }
    });

    if (!exam) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    return NextResponse.json(exam);
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
