'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, AlertCircle, CheckCircle } from 'lucide-react';
import AppSwal from '@/lib/swal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegistrationPage() {
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentFile || !paymentFile) {
      AppSwal.fire({ icon: 'error', title: 'GAGAL', text: 'Mohon unggah kedua dokumen persyaratan & bukti pembayaran.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('document', documentFile);
      formData.append('payment', paymentFile);

      const res = await fetch('/api/participant/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Gagal mengunggah berkas.');
      }

      setSuccess(true);
    } catch (err: any) {
      AppSwal.fire({ icon: 'error', title: 'GAGAL', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-l-[12px] border-amber-400 bg-white p-8 shadow-brutal-lg border-4 border-foreground relative overflow-hidden">
        <h1 className="text-4xl font-black uppercase tracking-wide text-[#001F3F]">
          UNGGAH BERKAS TIM & PEMBAYARAN
        </h1>
        <p className="mt-4 font-bold text-zinc-600 uppercase tracking-widest max-w-2xl">
          Sebagai tahap awal kompetisi, setiap tim wajib mengunggah dokumen persyaratan dasar dan bukti transfer pembayaran resmi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulir Upload */}
        <Card className="bg-white border-4 border-foreground shadow-brutal-lg rounded-none">
          <CardHeader className="border-b-4 border-foreground bg-amber-100 p-6">
            <CardTitle className="font-black uppercase text-2xl flex items-center gap-3">
              <UploadCloud className="w-6 h-6" /> FORMULIR PENGUNGGAHAN
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-3">
                <Label className="font-bold uppercase tracking-widest text-xs">Dokumen Tim (KTM & Surat Aktif)</Label>
                <Input 
                  type="file" 
                  accept=".pdf,.zip,.rar"
                  onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                  className="h-14 bg-zinc-50 border-4 border-foreground rounded-none shadow-brutal-sm cursor-pointer file:h-full file:bg-foreground file:text-white file:border-0 file:font-bold file:uppercase file:px-4 file:mr-4 font-bold text-sm" 
                />
                <p className="text-xs font-bold text-zinc-500 uppercase">GABUNGKAN SELURUH BERKAS (KTM, DLL) DALAM 1 PDF/ZIP (MAX: 5MB)</p>
              </div>
              
              <div className="space-y-3">
                <Label className="font-bold uppercase tracking-widest text-xs">Bukti Pembayaran (Transfer HTH/Bank)</Label>
                <Input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg, .pdf"
                  onChange={(e) => setPaymentFile(e.target.files?.[0] || null)}
                  className="h-14 bg-zinc-50 border-4 border-foreground rounded-none shadow-brutal-sm cursor-pointer file:h-full file:bg-foreground file:text-white file:border-0 file:font-bold file:uppercase file:px-4 file:mr-4 font-bold text-sm" 
                />
                <p className="text-xs font-bold text-zinc-500 uppercase">Format Gambar/PDF Transaksi Resmi (MAX: 3MB)</p>
              </div>

              <Button disabled={isSubmitting || success} type="submit" className="w-full bg-accent text-foreground border-4 border-foreground shadow-[6px_6px_0_0_var(--color-foreground)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_0_var(--color-foreground)] transition-all font-bold text-lg uppercase italic tracking-widest h-14 mt-4 rounded-none disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? (
                  'MENGUNGGAH...'
                ) : (
                  <><UploadCloud className="mr-3 w-5 h-5" /> UNGGAH DOKUMEN TIM</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Status Box */}
        <div className="space-y-8">
          {success ? (
            <Card className="bg-green-100 border-4 border-foreground rounded-none h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 shadow-[8px_8px_0_0_black]">
              <CheckCircle className="w-16 h-16 text-green-600 mb-6" />
              <h3 className="text-5xl font-black uppercase tracking-wide text-foreground font-sans">BERKAS TERKIRIM</h3>
              <p className="font-bold text-foreground uppercase text-sm max-w-sm">
                Terima kasih! Seluruh berkas telah diterima server. Panitia membutuhkan 1-2 hari kerja untuk memverifikasi keabsahan dokumen dan pembayaran Anda.
              </p>
            </Card>
          ) : (
            <Card className="bg-zinc-100 border-4 border-dashed border-zinc-400 rounded-none h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8">
              <AlertCircle className="w-16 h-16 text-zinc-400 mb-6" />
              <h3 className="font-black uppercase text-2xl text-zinc-500 mb-4">BELUM ADA DOKUMEN</h3>
              <p className="font-bold text-zinc-500 uppercase text-sm max-w-sm">
                Silakan lengkapi formulir di samping kiri untuk mengunggah berkas. Gabungkan data dalam bentuk terpadu sebelum menekan tombol Unggah.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
