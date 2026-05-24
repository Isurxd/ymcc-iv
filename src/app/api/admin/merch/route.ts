import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRole } from '@/lib/auth';

// GET all products for management
export async function GET(req: Request) {
  try {
    const session = await verifyRole(req, ['ADMIN']);
    if (!session) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const products = await prisma.product.findMany({
      include: {
        variants: true
      },
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

// POST to create or update product
export async function POST(req: Request) {
  try {
    const session = await verifyRole(req, ['ADMIN']);
    if (!session) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const data = await req.json();
    const { id, name, description, price, imageUrl, variants } = data;

    if (id) {
      // UPDATE
      const updated = await prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          price: parseFloat(price),
          imageUrl,
          variants: {
            deleteMany: {}, // Simpler to reset variants for this internal tool
            create: variants.map((v: any) => ({
              size: v.size,
              stock: parseInt(v.stock)
            }))
          }
        }
      });
      return NextResponse.json(updated);
    } else {
      // CREATE
      const created = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          imageUrl,
          variants: {
            create: variants.map((v: any) => ({
              size: v.size,
              stock: parseInt(v.stock)
            }))
          }
        }
      });
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error saving product' }, { status: 500 });
  }
}
