'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Search, Download, ShieldAlert, QrCode } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { QRCodeSVG } from 'qrcode.react';

export default function DashboardPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/participant/exam-status'); // Mengambil status pendaftaran
        const data = await res.json();
        setStatus(data);

        // Munculkan SweetAlert jika belum terverifikasi
        if (data && data.canTakeExam === false && data.registrationStatus !== 'APPROVED') {
          Swal.fire({
            title: 'TIM BELUM TERVERIFIKASI',
            text: 'Tim Anda belum bisa mengikuti ujian karena berkas atau pembayaran belum diverifikasi admin.',
            icon: 'info',
            confirmButtonText: 'OKE, SAYA MENGERTI',
            confirmButtonColor: '#001F3F',
            footer: '<span style="color: #ff0000; font-weight: bold;">Pastikan semua berkas sudah diunggah!</span>'
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-l-[12px] border-accent bg-white p-8 shadow-brutal-lg border-4 border-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <h1 className="text-5xl font-black uppercase tracking-wide text-[#001F3F]">
          PORTAL PESERTA
        </h1>
        <p className="mt-4 font-bold text-zinc-600 uppercase tracking-widest relative z-10 max-w-2xl">
          Sistem Command Center YMCC VII. Status Tim: <span className={status?.canTakeExam ? 'text-green-600' : 'text-red-500'}>{status?.canTakeExam ? 'SIAP BERLAGA' : 'MENUNGGU VERIFIKASI'}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Status Berkasi */}
        <Card className="bg-white border-4 border-foreground shadow-brutal-lg rounded-none hover:-translate-y-2 hover:shadow-[12px_12px_0_0_var(--color-foreground)] transition-all duration-300">
          <CardHeader className={`border-b-4 border-foreground p-6 ${status?.canTakeExam ? 'bg-green-100' : 'bg-cyan-100'}`}>
            <CardTitle className="font-black uppercase text-2xl flex items-center gap-3">
              <Upload className="w-6 h-6" /> BERKAS TIM
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b-2 border-dashed border-zinc-200 pb-2">
                <span className="font-bold text-sm text-zinc-500 uppercase">Status Verifikasi</span>
                <span className={`text-white text-xs font-bold px-2 py-1 uppercase shadow-brutal-sm ${status?.canTakeExam ? 'bg-green-500' : 'bg-red-500'}`}>
                  {status?.canTakeExam ? 'TERVERIFIKASI' : 'PENDING'}
                </span>
              </div>
              <p className="text-zinc-600 font-medium text-sm leading-relaxed">
                {status?.canTakeExam 
                  ? 'Berkas Anda sudah sah. Anda diperbolehkan melanjutkan ke tahap ujian E-CBT.' 
                  : 'Harap periksa kembali berkas Anda atau hubungi admin jika verifikasi memakan waktu lama.'}
              </p>
              <Link href="/dashboard/registration" className="block w-full text-center bg-foreground text-white font-bold py-3 uppercase hover:bg-accent hover:text-foreground transition-colors border-2 border-transparent hover:border-foreground">
                LIHAT DETAIL BERKAS
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* E-CBT Status */}
        <Card className="bg-white border-4 border-foreground shadow-brutal-lg rounded-none hover:-translate-y-2 hover:shadow-[12px_12px_0_0_var(--color-foreground)] transition-all duration-300">
          <CardHeader className={`border-b-4 border-foreground p-6 ${status?.canTakeExam ? 'bg-accent' : 'bg-amber-100'}`}>
            <CardTitle className="font-black uppercase text-2xl flex items-center gap-3">
              <Search className="w-6 h-6" /> {status?.canTakeExam ? 'E-CBT READY' : 'E-CBT LOCKED'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b-2 border-dashed border-zinc-200 pb-2">
                <span className="font-bold text-sm text-zinc-500 uppercase">Sistem Ujian</span>
                <span className={`text-xs font-bold px-2 py-1 uppercase border ${status?.canTakeExam ? 'bg-green-500 text-white border-green-600' : 'bg-zinc-200 text-zinc-500 border-zinc-400'}`}>
                  {status?.canTakeExam ? 'TERBUKA' : 'TERKUNCI'}
                </span>
              </div>
              <p className="text-zinc-600 font-medium text-sm leading-relaxed">
                {status?.canTakeExam 
                  ? 'Sistem ujian sudah terbuka. Silakan masuk dan kerjakan soal tepat waktu.' 
                  : 'Sistem ujian E-CBT akan terbuka otomatis saat berkas Anda disetujui oleh panitia.'}
              </p>
              {status?.canTakeExam ? (
                <Link href="/dashboard/exam" className="block w-full text-center bg-accent text-foreground font-bold py-3 uppercase hover:bg-foreground hover:text-white transition-colors border-4 border-foreground shadow-brutal-sm">
                  MASUK KE SISTEM UJIAN
                </Link>
              ) : (
                <button disabled className="w-full bg-zinc-300 text-zinc-500 font-bold py-3 uppercase rounded-none border-0 opacity-50 cursor-not-allowed">
                  Akses Terkunci
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* QR Code Identification */}
        <Card className="bg-white border-4 border-foreground shadow-brutal-lg rounded-none hover:-translate-y-2 transition-all duration-300 overflow-hidden">
          <CardHeader className="bg-[#CCFF00] border-b-4 border-foreground p-6">
            <CardTitle className="font-black uppercase text-2xl flex items-center gap-3 italic">
              <QrCode className="w-6 h-6" /> QR IDENTITAS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 flex flex-col items-center justify-center">
            {status?.registrationId ? (
              <div className="bg-white p-4 border-4 border-foreground shadow-[6px_6px_0_0_#000]">
                <QRCodeSVG 
                  value={status.registrationId} 
                  size={160}
                  level="H"
                  includeMargin={false}
                />
              </div>
            ) : (
               <div className="w-40 h-40 bg-zinc-100 border-4 border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 font-bold text-xs text-center p-4">
                  QR GENERATING...
               </div>
            )}
            <p className="mt-6 text-[10px] font-black uppercase text-zinc-500 tracking-tighter text-center">
              TUNJUKKAN QR INI KEPADA PANITIA UNTUK PRESENSI KEHADIRAN (ABSENSI)
            </p>
          </CardContent>
        </Card>

        {/* Guidebook */}
        <Card className="bg-foreground text-white border-4 border-accent shadow-[8px_8px_0_0_var(--color-accent)] rounded-none hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_var(--color-accent)] transition-all duration-300">
          <CardHeader className="p-6 border-b-2 border-zinc-800">
            <CardTitle className="font-black uppercase text-2xl text-accent">PANDUAN</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col justify-between h-[calc(100%-80px)]">
            <p className="text-zinc-300 font-medium text-sm leading-relaxed mb-6">
              Unduh panduan resmi YMCC VII untuk memahami regulasi teknis ujian dan dokumen.
            </p>
            <button 
              onClick={() => Swal.fire('INFO PANDUAN', 'Panduan Teknis (PDF) sedang dalam proses finalisasi oleh panitia. Mohon cek kembali secara berkala.', 'info')}
              className="w-full bg-accent text-foreground font-bold py-3 uppercase rounded-none border-2 border-transparent hover:border-white hover:bg-transparent hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> UNDUH PDF
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

