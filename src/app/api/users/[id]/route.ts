import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'Missing user ID' }, { status: 400 });
    }

    if (body.action === 'UPDATE_ROLE') {
      const { role } = body;
      if (!role) return NextResponse.json({ message: 'Missing role' }, { status: 400 });

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { role },
        select: { id: true, name: true, role: true }
      });
      return NextResponse.json({ message: 'Role updated', user: updatedUser }, { status: 200 });

    } else if (body.action === 'RESET_PASSWORD') {
      const { newPassword } = body;
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
        select: { id: true, name: true }
      });
      return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });

    } else {
      return NextResponse.json({ message: 'Invalid action specified' }, { status: 400 });
    }

  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
