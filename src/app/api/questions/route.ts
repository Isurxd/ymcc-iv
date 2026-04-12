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

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ message: 'Konten soal wajib diisi' }, { status: 400 });
    }

    // Find or create a master event
    let event = await prisma.event.findFirst();
    if (!event) {
      event = await prisma.event.create({
        data: { 
          name: 'SYSTEM MASTER EVENT', 
          startDate: new Date(), 
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) // +1 year
        }
      });
    }

    // Find or create a master exam
    let exam = await prisma.exam.findFirst();
    if (!exam) {
      exam = await prisma.exam.create({
        data: { 
          eventId: event.id, 
          title: 'MASTER LIVE EXAM', 
          durationMin: 120 
        }
      });
    }

    const question = await prisma.question.create({
      data: {
        examId: exam.id,
        content,
        options: "[]",
        answerKey: "A",
        points: 10
      }
    });

    return NextResponse.json(question);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
