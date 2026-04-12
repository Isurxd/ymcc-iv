import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET() {
  try {
    const attempts = await prisma.examAttempt.findMany({
      where: { score: { not: null } },
      include: {
        registration: {
          include: { user: true }
        }
      },
      orderBy: { score: 'desc' },
      take: 5
    });

    const leaderboard = attempts.map((att, idx) => ({
      rank: idx + 1,
      name: att.registration.user.name.toUpperCase(),
      score: att.score || 0
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
