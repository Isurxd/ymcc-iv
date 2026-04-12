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

    const { registrationId } = await req.json();

    if (!registrationId) {
      return NextResponse.json({ message: 'Registration ID required' }, { status: 400 });
    }

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { event: true }
    });

    if (!registration) {
      return NextResponse.json({ message: 'INVALID - ID Tidak Ditemukan', status: 'INVALID' }, { status: 404 });
    }

    if (registration.status !== 'VERIFIED') {
      return NextResponse.json({ message: `INVALID - Status ID: ${registration.status}`, status: 'INVALID' }, { status: 400 });
    }

    // Check if already attended
    const existing = await prisma.attendance.findFirst({
      where: { registrationId: registrationId, eventId: registration.eventId }
    });

    if (existing) {
      return NextResponse.json({ message: 'ALREADY SCANNED - Tim sudah absen', status: 'INVALID' }, { status: 400 });
    }

    // Create attendance record
    await prisma.attendance.create({
      data: {
        registrationId: registrationId,
        eventId: registration.eventId,
        status: 'VALID',
        scannedById: session.sub
      }
    });

    return NextResponse.json({ 
       message: 'VALID - Presensi Berhasil', 
       status: 'VALID',
       teamId: registrationId,
       eventName: registration.event.name
    });
  } catch (error) {
    console.error('Attendance error:', error);
    return NextResponse.json({ message: 'ERROR - Internal Error', status: 'INVALID' }, { status: 500 });
  }
}
