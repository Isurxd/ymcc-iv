import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session_token');
    
    if (!sessionCookie) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const session = await decrypt(sessionCookie.value);
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPERADMIN')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { action, notes } = await req.json(); // action can be 'APPROVE' or 'REJECT'
    const { id: documentId } = await context.params;

    const document = await prisma.document.findUnique({ where: { id: documentId } });
    if (!document) return NextResponse.json({ message: 'Document not found' }, { status: 404 });

    if (action === 'APPROVE') {
      await prisma.$transaction([
        prisma.document.update({
          where: { id: documentId },
          data: { isVerified: true, notes: null }
        }),
        prisma.registration.update({
          where: { id: document.registrationId },
          data: { status: 'VERIFIED' }
        })
      ]);
      return NextResponse.json({ message: 'Document approved' });
    } else if (action === 'REJECT') {
      await prisma.$transaction([
        prisma.document.update({
           where: { id: documentId },
           data: { notes: notes || 'Berkas tidak valid. Harap unggah ulang.', isVerified: false } // Update note so participant knows
        }),
        prisma.registration.update({
           where: { id: document.registrationId },
           data: { status: 'PENDING_DOCUMENT' } // Push back to document stage
        })
      ]);
      return NextResponse.json({ message: 'Document rejected' });
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Verify document error:', error);
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
  }
}
