'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Database, Plus } from 'lucide-react';
import AppSwal from '@/lib/swal';

export default function BankSoalPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menyimpan soal');
      
      AppSwal.fire({
        title: 'SOAL TERSIMPAN!',
        text: 'Soal berhasil diinjeksi ke Database Master.',
        icon: 'success'
      });
      setContent('');
    } catch (err: any) {
      AppSwal.fire({ title: 'ERROR', text: err.message, icon: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="mb-10 border-b-4 border-foreground pb-6 bg-white p-6 shadow-brutal-sm">
        <h1 className="text-5xl font-black tracking-wide text-foreground uppercase">
          KOTAK INJEKSI SOAL.
        </h1>
        <p className="text-zinc-600 font-bold uppercase mt-2">Masukan soal tunggal untuk ditembakkan ke Live Broadcast Videotron.</p>
      </header>

      <Card className="rounded-none border-4 border-foreground shadow-[8px_8px_0_0_#CCFF00] bg-white">
        <CardHeader className="bg-foreground text-white border-b-4 border-foreground p-6">
          <CardTitle className="text-3xl font-black uppercase tracking-wide flex items-center gap-3">
            <Database className="w-8 h-8 text-[#CCFF00]" />
            INJEKSI SOAL BARU
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
                KONTEN PERTANYAAN (UNTUK DITAMPILKAN DI VIDEOTRON)
              </label>
              <textarea 
                className="w-full border-4 border-foreground p-6 outline-none focus:border-[#E63E00] text-3xl font-black uppercase"
                rows={4}
                value={content}
                onChange={e => setContent(e.target.value)}
                required
                placeholder="CONTOH: APA SIMBOL KIMIA UNTUK EMAS?"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-20 bg-[#E63E00] hover:bg-[#001F3F] text-white border-4 border-foreground transition-all rounded-none font-black text-2xl uppercase tracking-widest hover:-translate-y-1 shadow-[4px_4px_0_0_#001F3F]"
            >
              {loading ? 'MENYIMPAN...' : 'SIMPAN KE DATABASE'} <Plus className="ml-3 w-8 h-8" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
