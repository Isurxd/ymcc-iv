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
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-[#001F3F]">Berita & Artikel CMS</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* FORM BAGIAN KIRI */}
        <div className="md:col-span-1">
          <Card>
             <CardHeader className="bg-gray-50 border-b">
               <CardTitle className="text-xl text-[#E63E00]">
                 {isEditing ? "Edit Artikel" : "Tulis Artikel Baru"}
               </CardTitle>
             </CardHeader>
             <CardContent className="p-6">
               <form onSubmit={handleSave} className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Judul Artikel</label>
                   <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Contoh: Info Lomba" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">URL Thumbnail (Opsional)</label>
                   <Input value={thumbnailUrl} onChange={e => setThumbnail(e.target.value)} placeholder="https://..." />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Konten Berita</label>
                   <textarea 
                     className="w-full h-48 border rounded-md p-3 focus:ring-[#FF4500] focus:border-[#FF4500] outline-none"
                     value={content}
                     onChange={e => setContent(e.target.value)}
                     required
                     placeholder="Tulis detail artikel dengan format HTML atau teks biasa..."
                   />
                 </div>
                 <div className="flex gap-2">
                   <Button type="submit" className="flex-1 bg-[#001F3F] text-white hover:bg-blue-900 border-none transition-transform active:scale-95">Simpan</Button>
                   {isEditing && <Button type="button" onClick={resetForm} className="bg-gray-200 text-black hover:bg-gray-300 transition-transform active:scale-95">Batal</Button>}
                 </div>
               </form>
             </CardContent>
          </Card>
        </div>

        {/* LIST BAGIAN KANAN */}
        <div className="md:col-span-2 space-y-4">
          {loading ? <p className="animate-pulse text-[#E63E00]">Memuat daftar artikel...</p> : 
           articles.map(art => (
             <Card key={art.id} className="flex flex-col md:flex-row shadow-sm hover:shadow transition-shadow">
               {art.thumbnailUrl && <img src={art.thumbnailUrl} alt="Thumbnail" className="w-full md:w-32 h-32 object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none" />}
               <div className="p-4 flex flex-col justify-between w-full">
                  <div>
                    <h3 className="font-bold text-lg text-[#001F3F] line-clamp-1">{art.title}</h3>
                    <p className="text-gray-500 text-xs mb-2 bg-gray-100 w-fit px-2 py-1 rounded">{new Date(art.createdAt).toLocaleDateString()}</p>
                    <p className="text-gray-700 line-clamp-2 text-sm max-w-xl">{art.content.replace(/<[^>]+>/g, '')}</p>
                  </div>
                  <div className="flex gap-2 mt-4 justify-end">
                    <Button onClick={() => {
                        setIsEditing(art.id);
                        setTitle(art.title);
                        setContent(art.content);
                        setThumbnail(art.thumbnailUrl || "");
                        window.scrollTo(0,0);
                    }} className="bg-white border border-[#E63E00] text-[#E63E00] hover:bg-[#E63E00] hover:text-white transition-colors px-4 py-1 h-8 rounded-md text-sm">Edit</Button>
                    <Button onClick={() => deleteArticle(art.id)} className="bg-red-500 text-white hover:bg-red-600 transition-colors px-4 py-1 h-8 rounded-md text-sm">Hapus</Button>
                  </div>
               </div>
             </Card>
           ))
          }
          {!loading && articles.length === 0 && <p className="text-gray-500 text-center py-12 border rounded-md bg-gray-50">Belum ada artikel yang diterbitkan.</p>}
        </div>
      </div>
    </div>
  )
}
