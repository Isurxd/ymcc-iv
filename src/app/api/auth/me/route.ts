import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';

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

    return NextResponse.json({
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('API /auth/me Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
