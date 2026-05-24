import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: examId } = await params;

    const questions = await prisma.question.findMany({
      where: { examId },
      select: {
        id: true,
        content: true,
        options: true,
        points: true
      }
    });

    const randomized = questions.map(q => ({
      ...q,
      options: JSON.parse(q.options || "[]")
    }));

    return NextResponse.json(randomized);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching questions' }, { status: 500 });
  }
}
