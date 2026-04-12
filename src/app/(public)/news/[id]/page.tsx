import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";

const prisma = new PrismaClient();

// Server Component for fast loading and SEO
export default async function NewsDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const article = await prisma.article.findUnique({
     where: { id: resolvedParams.id }
  });

  if (!article) return notFound();

  return (
    <main className="min-h-screen bg-[#FDFDFD]">
      {/* Hero Header */}
      <div className="w-full bg-gradient-to-r from-[#001F3F] to-[#003366] py-24 px-4 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E63E00] opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-md">{article.title}</h1>
           <div className="inline-flex items-center bg-[#E63E00] text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
             <span className="mr-2">📅</span>
             {new Date(article.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-3xl px-4 py-16 -mt-10 relative z-20">
         <div className="bg-white p-6 md:p-12 rounded-2xl shadow-xl border border-gray-100">
           {article.thumbnailUrl && (
             <div className="w-full overflow-hidden rounded-xl shadow-md mb-10 group">
                <img src={article.thumbnailUrl} alt={article.title} className="w-full object-cover max-h-[450px] transition-transform duration-700 group-hover:scale-105" />
             </div>
           )}
           
           <article 
              className="prose prose-lg lg:prose-xl max-w-none text-gray-700 leading-relaxed font-sans prose-headings:text-[#001F3F] prose-a:text-[#E63E00]" 
              dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} 
           />

           <div className="mt-20 pt-10 border-t border-gray-200 flex justify-center">
              <Link href="/news">
                 <button className="bg-[#E63E00] hover:bg-[#FF4500] text-white px-10 py-3 rounded-full font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 flex items-center gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                   Kembali ke Berita Terkini
                 </button>
              </Link>
           </div>
         </div>
      </div>
    </main>
  );
}
