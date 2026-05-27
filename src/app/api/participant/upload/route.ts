import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    // 1. Verify Authentication
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session_token');
    
    if (!sessionCookie) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const session = await decrypt(sessionCookie.value);
    if (!session || !session.sub) {
      return NextResponse.json({ message: 'Invalid session' }, { status: 401 });
    }

    const userId = session.sub as string;

    // 2. Parse Multipart Form Data
    const formData = await req.formData();
    const documentFile = formData.get('document') as File | null;
    const paymentFile = formData.get('payment') as File | null;

    if (!documentFile || !paymentFile) {
      return NextResponse.json({ message: 'Both document and payment files are required' }, { status: 400 });
    }

    // 3. Save Files Locally (Simulation of Supabase)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure dir exists (ignore if already exists)
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (e) {
      // dir exists
    }

    const writeLocalFile = async (file: File, prefix: string) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${prefix}-${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const filepath = path.join(uploadsDir, filename);
      await writeFile(filepath, buffer);
      return `/uploads/${filename}`; // Return public URL
    };

    const docUrl = await writeLocalFile(documentFile, 'doc');
    const paymentUrl = await writeLocalFile(paymentFile, 'payment');

    // 4. Update Database
    // Ensure there is an Event to register to (fallback logic for phase 1)
    let event = await prisma.event.findFirst();
    if (!event) {
      event = await prisma.event.create({
        data: {
          name: 'YMCC VII Main Event',
          description: 'Main competition for YMCC VII',
          startDate: new Date(),
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        }
      });
    }

    // Check if registration exists
    let registration = await prisma.registration.findFirst({
      where: { userId, eventId: event.id }
    });

    if (registration && registration.status === 'VERIFIED_ADMIN') {
      return NextResponse.json({ 
        message: 'Data administrasi Anda sudah diverifikasi dan tidak dapat diubah (Immutable).' 
      }, { status: 403 });
    }

    if (!registration) {
      registration = await prisma.registration.create({
        data: {
          userId,
          eventId: event.id,
          status: 'VERIFYING_PAYMENT',
        }
      });
    } else {
      await prisma.registration.update({
        where: { id: registration.id },
        data: { status: 'VERIFYING_PAYMENT' }
      });
    }

    // Create Payment Record
    await prisma.payment.upsert({
      where: { registrationId: registration.id },
      update: { proofUrl: paymentUrl, amount: 150000 },
      create: {
        registrationId: registration.id,
        amount: 150000,
        proofUrl: paymentUrl,
      }
    });

    // Create Document Record
    await prisma.document.create({
      data: {
        registrationId: registration.id,
        fileName: documentFile.name,
        fileUrl: docUrl,
      }
    });

    return NextResponse.json({ message: 'Files uploaded and registration submitted successfully' }, { status: 200 });
    
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
