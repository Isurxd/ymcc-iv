'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Search, Download } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-l-[12px] border-accent bg-white p-8 shadow-brutal-lg border-4 border-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <h1 className="text-5xl md:text-6xl font-heading font-black italic uppercase tracking-tight text-foreground relative z-10 drop-shadow-[4px_4px_0_var(--color-accent)] [-webkit-text-stroke:1px_var(--color-foreground)]">
          PORTAL PESERTA
        </h1>
        <p className="mt-4 font-bold text-zinc-600 uppercase tracking-widest relative z-10 max-w-2xl">
          Selamat datang di komando pusat. Persiapkan berkas Anda, unggah persyaratan wajib, dan hadapi tantangan pertambangan terhebat di Indonesia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Status Registration */}
        <Card className="bg-white border-4 border-foreground shadow-brutal-lg rounded-none hover:-translate-y-2 hover:shadow-[12px_12px_0_0_var(--color-foreground)] transition-all duration-300">
          <CardHeader className="border-b-4 border-foreground bg-cyan-100 p-6">
            <CardTitle className="font-heading italic uppercase text-2xl flex items-center gap-3">
              <Upload className="w-6 h-6" /> BERKAS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b-2 border-dashed border-zinc-200 pb-2">
                <span className="font-bold text-sm text-zinc-500 uppercase">Status</span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 uppercase shadow-brutal-sm">Belum Lengkap</span>
              </div>
              <p className="text-zinc-600 font-medium text-sm leading-relaxed">
                Anda belum mengunggah dokumen persyaratan tim. Harap lengkapi sebelum batas waktu berakhir.
              </p>
              <Link href="/dashboard/registration" className="block w-full text-center bg-foreground text-white font-bold py-3 uppercase hover:bg-accent hover:text-foreground transition-colors border-2 border-transparent hover:border-foreground">
                LENGKAPI SEKARANG
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* E-CBT Status */}
        <Card className="bg-white border-4 border-foreground shadow-brutal-lg rounded-none hover:-translate-y-2 hover:shadow-[12px_12px_0_0_var(--color-foreground)] transition-all duration-300">
          <CardHeader className="border-b-4 border-foreground bg-amber-100 p-6">
            <CardTitle className="font-heading italic uppercase text-2xl flex items-center gap-3">
              <Search className="w-6 h-6" /> E-CBT TEST
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b-2 border-dashed border-zinc-200 pb-2">
                <span className="font-bold text-sm text-zinc-500 uppercase">Akses</span>
                <span className="bg-zinc-200 text-zinc-500 text-xs font-bold px-2 py-1 uppercase border border-zinc-400">Terkunci</span>
              </div>
              <p className="text-zinc-600 font-medium text-sm leading-relaxed">
                Sistem ujian E-CBT akan terbuka otomatis saat berkas Anda disetujui oleh panitia.
              </p>
              <button disabled className="w-full bg-zinc-300 text-zinc-500 font-bold py-3 uppercase rounded-none border-0 opacity-50 cursor-not-allowed">
                MASUK KE SISTEM (KUNCI)
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Guidebook */}
        <Card className="bg-foreground text-white border-4 border-accent shadow-[8px_8px_0_0_var(--color-accent)] rounded-none hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_var(--color-accent)] transition-all duration-300">
          <CardHeader className="p-6 border-b-2 border-zinc-800">
            <CardTitle className="font-heading italic uppercase text-2xl text-accent">PANDUAN</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col justify-between h-[calc(100%-80px)]">
            <p className="text-zinc-300 font-medium text-sm leading-relaxed mb-6">
              Unduh panduan resmi YMCC VII untuk memahami regulasi teknis dan persyaratan dokumen yang dibutuhkan.
            </p>
            <button className="w-full bg-accent text-foreground font-bold py-3 uppercase rounded-none border-2 border-transparent hover:border-white hover:bg-transparent hover:text-white transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> UNDUH PANDUAN
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
