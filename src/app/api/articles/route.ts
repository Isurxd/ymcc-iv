import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, content, thumbnailUrl, authorId, published } = await req.json();
    let realAuthorId = authorId;
    
    // Auto-assign author if not provided (fallback mechanism)
    if (!realAuthorId) {
      let opUser = await prisma.user.findFirst({ where: { role: 'OPERATOR' } });
      if (!opUser) {
        opUser = await prisma.user.findFirst();
        if (!opUser) {
           opUser = await prisma.user.create({
             data: { email: "operator@ymcc.com", name: "Operator System", role: "OPERATOR", password: "tmp" }
           });
        }
      }
      realAuthorId = opUser.id;
    }

    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        thumbnailUrl: thumbnailUrl || null,
        authorId: realAuthorId,
        published: published ?? true
      }
    });
    return NextResponse.json(newArticle);
  } catch (error: any) {
    console.error("Article creating error:", error);
    return NextResponse.json({ error: error.message || "Failed to create article" }, { status: 500 });
  }
}
