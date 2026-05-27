"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";

export default function NewsPage() {
  const { lang } = useLanguage();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles")
      .then(r => r.json())
      .then(data => {
        setArticles(data || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-white bg-grid-dots pt-40 pb-32 relative overflow-hidden text-[#001F3F]">
      {/* Brand Background Accents */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-[#CCFF00]/5 rounded-full blur-[140px] -z-10" />
      <div className="absolute bottom-0 left-[-10rem] w-[40rem] h-[40rem] bg-[#E63E00]/5 rounded-full blur-[140px] -z-10" />

      <div className="container mx-auto px-6 max-w-7xl uppercase">
        <header className="mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 bg-[#E63E00]/10 border border-[#E63E00]/20 px-5 py-2 rounded-full mb-10">
               <span className="w-2 h-2 bg-[#E63E00] rounded-full animate-pulse shadow-[0_0_12px_#E63E00]" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E63E00]">
                 Live Intel Feed
               </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-[-0.05em] leading-[0.85] text-[#001F3F]">
              News & <br/> <span className="text-[#E63E00] drop-shadow-2xl">Updates.</span>
            </h1>
            
            <p className="mt-10 text-xl font-medium text-zinc-400 max-w-lg leading-relaxed italic opacity-70">
              LATEST INTELLIGENCE ON COMPETITION CYCLES, MINING TECHNOLOGY, AND STRATEGIC ANNOUNCEMENTS.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
             <div className="w-20 h-20 border-4 border-zinc-100 border-t-[#CCFF00] rounded-full animate-spin mb-8" />
             <span className="font-black text-sm tracking-[0.5em] text-zinc-300 animate-pulse">Syncing Intelligence...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {articles.map((art, i) => (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[4rem] p-4 shadow-soft hover:shadow-premium transition-all duration-1000 border border-[#001F3F]/5 group flex flex-col h-full relative"
                >
                  <div className="aspect-video rounded-[3rem] bg-zinc-50 overflow-hidden relative mb-8">
                    {art.thumbnailUrl ? (
                      <img src={art.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={art.title} />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-[#001F3F] to-zinc-800 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-700">
                        <span className="text-white/20 font-black text-4xl uppercase tracking-tighter italic group-hover:text-[#CCFF00] transition-colors">YMCC VII</span>
                      </div>
                    )}
                  </div>

                  <div className="px-6 flex-grow">
                    <div className="flex items-center gap-3 mb-6">
                       <Calendar className="w-3 h-3 text-[#E63E00]" />
                       <span className="text-[9px] font-black tracking-widest text-zinc-400 opacity-60">
                         {new Date(art.createdAt).toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                       </span>
                    </div>

                    <h3 className="text-2xl font-black text-[#001F3F] mb-6 line-clamp-2 leading-[0.95] tracking-tighter group-hover:text-[#E63E00] transition-colors duration-500 uppercase">
                      {art.title}
                    </h3>
                    
                    <p className="text-zinc-500 line-clamp-3 mb-10 text-xs font-medium leading-relaxed italic opacity-60">
                      {art.content.replace(/<[^>]+>/g, '')}
                    </p>
                  </div>

                  <div className="px-2 pb-2">
                    <Link href={`/news/${art.id}`} className="w-full h-16 bg-[#001F3F]/5 rounded-[2.5rem] font-black text-[10px] tracking-widest text-[#001F3F] flex items-center justify-center gap-2 group-hover:bg-[#E63E00] group-hover:text-white transition-all duration-500">
                      {lang === 'ID' ? 'BACA SELENGKAPNYA' : 'FULL ACCESS'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {articles.length === 0 && (
              <div className="col-span-full py-40 bg-zinc-50/50 rounded-[5rem] border-2 border-dashed border-zinc-100 flex flex-col items-center justify-center">
                 <Newspaper className="w-16 h-16 text-zinc-200 mb-6" />
                 <span className="text-zinc-300 font-black tracking-[0.3em] text-sm">NO DATA DETECTED IN FEED.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
