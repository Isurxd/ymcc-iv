import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';


export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing email or password' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT token payload
    const tokenData = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    // Encrypt to JWE token
    const token = await encrypt(tokenData);

    // Create response with Set-Cookie header
    const response = NextResponse.json({ 
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    }, { status: 200 });

    response.cookies.set({
      name: 'session_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: `Error Detail: ${errorMsg}` }, { status: 500 });
  }
}
