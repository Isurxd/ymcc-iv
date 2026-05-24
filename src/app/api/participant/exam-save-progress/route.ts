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

    const { examId, answers } = await req.json();

    const registration = await prisma.registration.findFirst({
      where: { userId: payload.sub as string }
    });

    if (!registration) {
      return NextResponse.json({ message: 'Registration not found' }, { status: 404 });
    }

    // Update the In-Progress attempt
    await prisma.examAttempt.updateMany({
      where: {
        registrationId: registration.id,
        examId,
        status: 'IN_PROGRESS'
      },
      data: {
        answers,
      }
    });

    return NextResponse.json({ message: 'Progress saved' });

  } catch (error) {
    console.error('Save Progress API Error:', error);
    return NextResponse.json({ message: 'Error saving progress' }, { status: 500 });
  }
}
