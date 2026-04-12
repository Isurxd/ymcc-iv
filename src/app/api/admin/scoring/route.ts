import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session_token');
    
    if (!sessionCookie) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const session = await decrypt(sessionCookie.value);
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { registrationId, score, category } = await req.json();

    if (!registrationId || score === undefined || !category) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId }
    });

    if (!registration) {
      return NextResponse.json({ message: 'Registration ID tidak ditemukan' }, { status: 404 });
    }

    // We use ExamAttempt to store manual scores for now
    // Find a dummy or main exam for the event to tie this attempt to, or create one if not found.
    let exam = await prisma.exam.findFirst({
      where: { eventId: registration.eventId, title: category }
    });

    if (!exam) {
      exam = await prisma.exam.create({
        data: {
          eventId: registration.eventId,
          title: category,
          description: `Kategori Penilaian: ${category}`,
        }
      });
    }

    // Upsert ExamAttempt
    await prisma.examAttempt.create({
      data: {
        registrationId,
        examId: exam.id,
        score: parseInt(score),
        status: 'COMPLETED'
      }
    });

    return NextResponse.json({ message: 'Nilai berhasil disimpan', teamId: registrationId, score: parseInt(score), category });
  } catch (error) {
    console.error('Scoring error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
