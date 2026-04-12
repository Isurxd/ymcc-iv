import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET() {
  try {
    const count = await prisma.user.count({
      where: { role: 'USER' }
    });
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
