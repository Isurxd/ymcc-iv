"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NewsPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles").then(r => r.json()).then(data => {
      setArticles(data || []);
      setLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#001F3F] mb-4">Berita & Informasi</h1>
          <p className="text-gray-600">Pembaruan terbaru seputar YMCC VII, kompetisi, dan kegiatan menarik lainnya.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#E63E00] animate-pulse font-medium text-lg">Memuat Berita...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((art) => (
              <Card key={art.id} className="overflow-hidden hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full bg-white border-0 shadow-lg select-none group">
                {art.thumbnailUrl ? (
                  <div className="h-48 overflow-hidden">
                    <img src={art.thumbnailUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={art.title} />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-tr from-[#E63E00] to-[#FF4500] flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    <span className="text-white font-bold opacity-30 text-3xl tracking-widest drop-shadow-md">YMCC VII</span>
                  </div>
                )}
                <CardContent className="p-6 flex flex-col flex-1 relative z-10 bg-white">
                  <p className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500 mb-4 font-semibold w-fit">{new Date(art.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <h3 className="text-xl font-bold text-[#001F3F] mb-3 line-clamp-2 leading-tight group-hover:text-[#E63E00] transition-colors">{art.title}</h3>
                  <p className="text-gray-600 line-clamp-3 mb-6 flex-1 text-sm leading-relaxed">{art.content.replace(/<[^>]+>/g, '')}</p>
                  <Link href={`/news/${art.id}`} className="mt-auto block">
                     <Button className="w-full bg-white text-[#E63E00] border border-[#E63E00] hover:bg-[#E63E00] hover:text-white transition-all duration-300 font-bold shadow-sm hover:shadow-md h-11">
                        Baca Selengkapnya
                     </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
            {articles.length === 0 && <div className="col-span-full text-center text-gray-500 py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">Belum ada berita yang diterbitkan untuk saat ini.</div>}
          </div>
        )}
      </div>
    </main>
  );
}
