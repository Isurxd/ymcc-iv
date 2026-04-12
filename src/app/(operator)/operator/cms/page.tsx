"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppSwal from "@/lib/swal";

export default function OperatorCMS() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnail] = useState("");
  const [isEditing, setIsEditing] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, content, thumbnailUrl };
    try {
      let res;
      if (isEditing) {
        res = await fetch(`/api/articles/${isEditing}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error("Gagal menyimpan");
      AppSwal.fire({ icon: 'success', title: 'BERHASIL', text: 'Artikel disimpan!' });
      resetForm();
      fetchArticles();
    } catch (err: any) {
      AppSwal.fire({ icon: 'error', title: 'ERROR', text: err.message });
    }
  };

  const deleteArticle = async (id: string) => {
    const result = await AppSwal.fire({
      title: 'HAPUS ARTIKEL?',
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });
    if (!result.isConfirmed) return;
    
    try {
      await fetch(`/api/articles/${id}`, { method: "DELETE" });
      fetchArticles();
    } catch (err) {
      AppSwal.fire({ icon: 'error', title: 'GAGAL', text: 'Gagal menghapus artikel' });
    }
  }

  const resetForm = () => {
    setTitle("");
    setContent("");
    setThumbnail("");
    setIsEditing(null);
  };

  return (
    <div className="space-y-6">
      <header className="mb-10 border-b-4 border-foreground pb-6 bg-white p-6 shadow-brutal-sm">
        <h1 className="text-5xl font-black tracking-wide text-foreground uppercase">
          CMS PUBLIKASI MEDIA.
        </h1>
        <p className="text-zinc-600 font-bold uppercase mt-2">Mesin pendorong artikel dan pembaruan berita publik YMCC VII.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* FORM BAGIAN KIRI */}
        <div className="md:col-span-1">
          <Card className="rounded-none border-4 border-foreground shadow-[6px_6px_0_0_#CCFF00] sticky top-8">
             <CardHeader className="bg-foreground border-b-4 border-foreground text-white p-6">
               <CardTitle className="text-2xl font-black uppercase tracking-wide">
                 {isEditing ? "UPDATE ARTIKEL" : "TULIS BERITA BARU"}
               </CardTitle>
             </CardHeader>
             <CardContent className="p-6">
               <form onSubmit={handleSave} className="space-y-4">
                 <div>
                   <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">Judul Artikel</label>
                   <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Contoh: Info Lomba" className="rounded-none border-2 border-foreground h-12 font-semibold" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">URL Thumbnail (Opsional)</label>
                   <Input value={thumbnailUrl} onChange={e => setThumbnail(e.target.value)} placeholder="https://..." className="rounded-none border-2 border-foreground h-12 font-semibold" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">Konten Berita</label>
                   <textarea 
                     className="w-full border-2 border-foreground rounded-none p-3 outline-none focus:border-[#E63E00] min-h-[200px] font-medium"
                     value={content}
                     onChange={e => setContent(e.target.value)}
                     required
                     placeholder="Tulis detail artikel dengan format HTML atau teks biasa..."
                   />
                 </div>
                 <div className="flex gap-4 pt-2">
                   <Button type="submit" className="flex-1 bg-[#E63E00] hover:bg-[#CCFF00] hover:text-[#001F3F] text-white border-2 border-transparent hover:border-[#001F3F] transition-all rounded-none h-14 font-black text-xl uppercase tracking-wider">
                     {isEditing ? "UPDATE" : "PUBLIKASIKAN"}
                   </Button>
                   {isEditing && (
                     <Button type="button" onClick={resetForm} className="bg-zinc-200 text-foreground hover:bg-zinc-300 border-2 border-transparent transition-all rounded-none h-14 font-black text-xl uppercase tracking-wider">
                       BATAL
                     </Button>
                   )}
                 </div>
               </form>
             </CardContent>
          </Card>
        </div>

        {/* LIST BAGIAN KANAN */}
        <div className="md:col-span-2 space-y-6">
          {loading ? (
            <div className="bg-white border-4 border-foreground p-8 text-center animate-pulse">
              <p className="font-black text-2xl uppercase tracking-wide text-[#E63E00]">MENGAKSES SERVER PUBLIKASI...</p>
            </div>
          ) : articles.map(art => (
             <Card key={art.id} className="rounded-none border-4 border-foreground bg-white shadow-brutal-sm hover:-translate-y-1 hover:shadow-brutal-lg transition-all overflow-hidden flex flex-col md:flex-row">
               {art.thumbnailUrl ? (
                 <img src={art.thumbnailUrl} alt="Thumbnail" className="w-full md:w-48 h-48 md:h-auto object-cover border-b-4 md:border-b-0 md:border-r-4 border-foreground" />
               ) : (
                 <div className="w-full md:w-48 h-48 md:h-auto bg-[#CCFF00] border-b-4 md:border-b-0 md:border-r-4 border-foreground flex items-center justify-center font-black text-[#001F3F] opacity-50 uppercase tracking-widest text-center px-4">
                   NO IMAGE
                 </div>
               )}
               <div className="p-6 flex flex-col justify-between w-full">
                  <div>
                    <h3 className="font-black text-2xl uppercase tracking-wide text-[#001F3F] mb-1 line-clamp-2">{art.title}</h3>
                    <div className="inline-block bg-[#001F3F] text-white text-[10px] font-bold px-2 py-1 mb-4 uppercase tracking-widest">
                      {new Date(art.createdAt).toLocaleDateString()}
                    </div>
                    <p className="text-zinc-600 font-semibold line-clamp-2 text-sm">{art.content.replace(/<[^>]+>/g, '')}</p>
                  </div>
                  <div className="flex gap-3 mt-6 pt-4 border-t-2 border-dashed border-zinc-200">
                    <Button onClick={() => {
                        setIsEditing(art.id);
                        setTitle(art.title);
                        setContent(art.content);
                        setThumbnail(art.thumbnailUrl || "");
                        window.scrollTo(0,0);
                    }} className="bg-transparent text-foreground hover:bg-[#CCFF00] border-2 border-foreground transition-colors rounded-none px-4 py-2 font-bold uppercase tracking-widest text-xs h-10">
                      REVISI
                    </Button>
                    <Button onClick={() => deleteArticle(art.id)} className="bg-zinc-100 text-red-600 hover:bg-red-600 hover:text-white border-2 border-red-600 transition-colors rounded-none px-4 py-2 font-bold uppercase tracking-widest text-xs h-10">
                      TARIK BERITA
                    </Button>
                  </div>
               </div>
             </Card>
            ))
          }
          {!loading && articles.length === 0 && (
            <div className="bg-zinc-100 border-4 border-dashed border-zinc-400 p-12 text-center rounded-none">
              <p className="font-black text-3xl text-zinc-400 uppercase tracking-wide">BELUM ADA PUBLIKASI.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
