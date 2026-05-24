import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'ymcc-vii-secret-key-fallback';
const key = new TextEncoder().encode(secretKey);

export interface AuthPayload {
  sub: string;
  role: string;
  email: string;
  name: string;
  [key: string]: any;
}

export async function encrypt(payload: AuthPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload as unknown as AuthPayload;
  } catch {
    return null;
  }
}

export async function verifyRole(req: Request, allowedRoles: string[]): Promise<AuthPayload | null> {
  const cookieHeader = req.headers.get('cookie');
  const token = cookieHeader
    ?.split(';')
    .find(c => c.trim().startsWith('session_token='))
    ?.split('=')[1];

  if (!token) return null;

  const payload = await decrypt(token);
  if (!payload) return null;

  const role = payload.role as string;
  if (!allowedRoles.includes(role) && role !== 'SUPERADMIN') {
    return null;
  }

  return payload;
}
