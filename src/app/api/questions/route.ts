import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      take: 20
    });

    const mapped = questions.map((q, idx) => ({
      id: `Q${idx + 1}`,
      text: q.content
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
