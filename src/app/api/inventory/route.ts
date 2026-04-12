import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        variants: true,
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Inventory fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { variantId, stock } = await req.json();
    if (!variantId || stock === undefined) {
      return NextResponse.json({ error: "Missing variantId or stock" }, { status: 400 });
    }

    const updatedVariant = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: parseInt(stock, 10) }
    });

    return NextResponse.json(updatedVariant);
  } catch (error) {
    console.error("Inventory update error:", error);
    return NextResponse.json({ error: "Failed to update stock" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, imageUrl, sizes } = body;

    if (!name || !description || price === undefined) {
      return NextResponse.json({ error: "Name, description, and price are required" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl: imageUrl || '',
        variants: {
          create: sizes && sizes.length > 0
            ? sizes.map((size: string) => ({ size, stock: 0 }))
            : [{ size: "ALL SIZE", stock: 0 }]
        }
      },
      include: {
        variants: true
      }
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Inventory creation error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
