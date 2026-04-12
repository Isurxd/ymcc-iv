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
