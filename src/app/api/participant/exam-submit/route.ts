import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await decrypt(sessionToken);
    if (!payload) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { examId, answers, cheatCount } = await req.json();

    // Find registration
    const registration = await prisma.registration.findFirst({
      where: { userId: payload.sub as string }
    });

    if (!registration) {
      return NextResponse.json({ message: 'Registration not found' }, { status: 404 });
    }

    // Calculate Score (Simple implementation)
    const questions = await prisma.question.findMany({
      where: { examId }
    });

    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.answerKey) {
        score += q.points;
      }
    });

    // Create ExamAttempt
    const attempt = await prisma.examAttempt.create({
      data: {
        registrationId: registration.id,
        examId,
        startTime: new Date(), // This should ideally be tracked from start
        endTime: new Date(),
        score,
        cheatCount,
        answers: JSON.stringify(answers),
        status: 'COMPLETED'
      }
    });

    return NextResponse.json({ 
      message: 'Ujian berhasil diserahkan', 
      score: attempt.score 
    });

  } catch (error) {
    console.error('Submit Exam API Error:', error);
    return NextResponse.json({ message: 'Error submitting exam' }, { status: 500 });
  }
}
