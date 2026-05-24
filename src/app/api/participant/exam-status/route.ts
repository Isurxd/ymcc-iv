import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
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

    // Fetch user registrations and current exams
    const registration = await prisma.registration.findFirst({
      where: { userId: payload.sub as string },
      include: {
        event: {
          include: {
            exams: true
          }
        },
        examAttempts: {
          where: { status: 'IN_PROGRESS' },
          orderBy: { startTime: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!registration) {
      return NextResponse.json({ 
        canTakeExam: false, 
        reason: 'Belum terdaftar di event apapun.' 
      });
    }

    const exam = registration.event.exams[0]; 

    if (registration.status !== 'APPROVED') {
      return NextResponse.json({ 
        canTakeExam: false, 
        registrationStatus: registration.status,
        reason: 'Pendaftaran Anda belum disetujui oleh panitia.' 
      });
    }

    if (!exam) {
      return NextResponse.json({ 
        canTakeExam: false, 
        reason: 'Belum ada jadwal ujian untuk cabang lomba ini.' 
      });
    }

    const existingAttempt = registration.examAttempts[0];

    return NextResponse.json({
      canTakeExam: true,
      examId: exam.id,
      examTitle: exam.title,
      durationMin: exam.durationMin,
      registrationId: registration.id,
      existingAttempt: existingAttempt ? {
        id: existingAttempt.id,
        answers: existingAttempt.answers || {},
        cheatCount: existingAttempt.cheatCount,
        startTime: existingAttempt.startTime
      } : null
    });

  } catch (error) {
    console.error('Exam Status API Error:', error);
    return NextResponse.json({ message: 'Error fetching status' }, { status: 500 });
  }
}
