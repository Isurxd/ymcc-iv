import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";

// Server Component for fast loading and SEO
export default async function NewsDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const article = await prisma.article.findUnique({
     where: { id: resolvedParams.id }
  });

  if (!article) return notFound();

  return (
    <main className="min-h-screen bg-white bg-grid-dots pt-40 pb-32 relative overflow-hidden text-[#001F3F]">
      {/* Brand Background Accents */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-[#CCFF00]/5 rounded-full blur-[140px] -z-10" />
      <div className="absolute top-1/2 left-[-10rem] w-[40rem] h-[40rem] bg-[#E63E00]/5 rounded-full blur-[140px] -z-10" />

      <div className="container mx-auto max-w-4xl px-6 relative z-10">
        
        {/* Back Button */}
        <Link href="/news" className="inline-flex items-center gap-3 text-zinc-400 hover:text-[#001F3F] transition-colors mb-12 group uppercase font-black text-[10px] tracking-widest">
           <div className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center group-hover:bg-[#CCFF00] group-hover:border-[#CCFF00] transition-all">
              <ArrowLeft className="w-4 h-4" />
           </div>
           Back to Intel Feed
        </Link>

        {/* Article Header */}
        <div className="mb-16">
           <div className="inline-flex items-center gap-3 bg-[#E63E00]/10 border border-[#E63E00]/20 px-5 py-2 rounded-full mb-8">
              <Calendar className="w-3 h-3 text-[#E63E00]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E63E00]">
                {new Date(article.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
           </div>
           
           <h1 className="text-5xl md:text-7xl font-black uppercase tracking-[-0.05em] leading-[0.85] mb-10">
             {article.title}
           </h1>

           {/* Social / Share Placeholder */}
           <div className="flex items-center gap-6 pt-6 border-t border-zinc-100">
              <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full bg-zinc-100 border-2 border-white" />
                 ))}
              </div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Published by Media Dept</span>
           </div>
        </div>

        {/* Thumbnail */}
        {article.thumbnailUrl && (
          <div className="w-full aspect-video rounded-[4rem] overflow-hidden shadow-premium mb-20">
             <img src={article.thumbnailUrl} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content Body */}
        <article className="max-w-none">
           <div 
             className="prose prose-2xl prose-zinc prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:font-medium prose-p:leading-relaxed prose-strong:text-[#001F3F] text-zinc-600 uppercase italic font-medium"
             dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }}
           />
        </article>

        {/* End of Page CTA */}
        <div className="mt-32 p-14 bg-[#001F3F] rounded-[5rem] text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[#CCFF00]/5 pointer-events-none" />
           <h3 className="text-3xl md:text-5xl font-black text-white uppercase mb-8 tracking-tighter leading-none px-4">
             Ready to join the <br/> <span className="text-[#CCFF00]">competitions?</span>
           </h3>
           <Link href="/register" className="inline-flex bg-[#CCFF00] text-[#001F3F] px-14 py-6 rounded-full font-black text-lg uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#CCFF00]/20">
              Apply Now
           </Link>
        </div>
      </div>
    </main>
  );
}
