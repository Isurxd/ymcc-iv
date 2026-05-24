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

    const { examId } = await req.json();

    // Find registration
    const registration = await prisma.registration.findFirst({
      where: { userId: payload.sub as string }
    });

    if (!registration) {
      return NextResponse.json({ message: 'Registration not found' }, { status: 404 });
    }

    // Find or create attempt
    let attempt = await prisma.examAttempt.findFirst({
      where: { 
        registrationId: registration.id,
        examId,
        status: 'IN_PROGRESS'
      }
    });

    if (!attempt) {
      // If auto-start didn't create it, we create it here
      attempt = await prisma.examAttempt.create({
        data: {
          registrationId: registration.id,
          examId,
          cheatCount: 1,
          status: 'IN_PROGRESS'
        }
      });
    } else {
      // Increment cheatCount
      attempt = await prisma.examAttempt.update({
        where: { id: attempt.id },
        data: {
          cheatCount: { increment: 1 }
        }
      });
    }

    // Auto-disqualify logic
    if (attempt.cheatCount >= 3) {
      await prisma.examAttempt.update({
        where: { id: attempt.id },
        data: { 
          status: 'DISQUALIFIED',
          endTime: new Date()
        }
      });
      return NextResponse.json({ 
        message: 'DISKUALIFIKASI', 
        cheatCount: attempt.cheatCount,
        disqualified: true 
      });
    }

    return NextResponse.json({ 
      message: 'Pelanggaran tercatat', 
      cheatCount: attempt.cheatCount,
      disqualified: false 
    });

  } catch (error) {
    console.error('Exam Violation API Error:', error);
    return NextResponse.json({ message: 'Error recording violation' }, { status: 500 });
  }
}
