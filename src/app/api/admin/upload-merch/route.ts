import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { verifyRole } from '@/lib/auth';
import { existsSync } from 'fs';

export async function POST(req: Request) {
  try {
    const session = await verifyRole(req, ['ADMIN']);
    if (!session) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'merch');
    
    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const path = join(uploadDir, filename);
    await writeFile(path, buffer);
    
    // Public URL
    const url = `/uploads/merch/${filename}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
