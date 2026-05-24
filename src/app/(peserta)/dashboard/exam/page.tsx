'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Lock, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSocket } from '@/lib/socket-client';

export default function ExamPage() {
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExamRunning, setIsExamRunning] = useState(false);
  const violationCountRef = useRef(0);
  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();
    
    // Listen for global exam state
    socket.on('EXAM_STATE_SYNC', (data: { isExamRunning: boolean }) => {
      setIsExamRunning(data.isExamRunning);
    });

    const init = async () => {
      try {
        const [meRes, statusRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/participant/exam-status')
        ]);
        
        const meData = await meRes.json();
        const statusData = await statusRes.json();
        
        if (meData.user) setUser(meData.user);
        setStatus(statusData);

        // Initial check for live status
        const liveRes = await fetch('/api/exam-live-status');
        const liveData = await liveRes.json();
        setIsExamRunning(liveData.isExamRunning);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();

    return () => {
      socket.off('EXAM_STATE_SYNC');
    };
  }, []);

  const handleStartExam = () => {
    if (status?.canTakeExam && isExamRunning) {
      router.push(`/dashboard/exam/live?id=${status.examId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-l-[12px] border-amber-400 bg-white p-8 shadow-brutal-lg border-4 border-foreground relative overflow-hidden">
        <h1 className="text-4xl font-black uppercase tracking-wide text-[#001F3F]">
          PORTAL UJIAN (E-CBT)
        </h1>
        <p className="mt-4 font-bold text-zinc-600 uppercase tracking-widest max-w-2xl text-sm leading-relaxed">
          Sistem Ujian Berbasis Komputer. Pastikan koneksi stabil sebelum memulai. Pelanggaran (pindah tab) akan terekam otomatis.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
        <Card className={`bg-white border-4 border-foreground shadow-[16px_16px_0_1px_var(--color-foreground)] rounded-none ${status?.canTakeExam ? 'ring-8 ring-accent/20' : ''}`}>
          <CardHeader className={`border-b-4 border-foreground p-8 text-center ${status?.canTakeExam ? 'bg-green-500' : 'bg-[#001F3F]'}`}>
            {status?.canTakeExam ? (
              <ShieldAlert className="w-16 h-16 text-white mx-auto mb-4 animate-bounce" />
            ) : (
              <Lock className="w-16 h-16 text-accent mx-auto mb-4" />
            )}
            <CardTitle className="font-black uppercase text-3xl md:text-4xl text-white">
              {status?.canTakeExam ? 'UJIAN TERSEDIA!' : 'SISTEM MASIH TERKUNCI'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 md:p-12 text-center space-y-8">
            
            <div className={`border-4 p-6 max-w-lg mx-auto ${status?.canTakeExam ? 'bg-green-50 border-green-200' : 'bg-zinc-100 border-zinc-200'}`}>
              <p className="font-bold text-lg text-zinc-500 uppercase tracking-widest mb-2">STATUS TIM ANDA</p>
              <h2 className={`font-black text-3xl uppercase ${status?.canTakeExam ? 'text-green-600' : 'text-red-500'}`}>
                {status?.canTakeExam ? 'TERVERIFIKASI' : (status?.registrationStatus || 'BELUM TERDAFTAR')}
              </h2>
            </div>
            
            {status?.canTakeExam ? (
              <div className="space-y-4 text-left max-w-xl mx-auto border-l-4 border-green-500 pl-6">
                <h3 className="font-black text-2xl uppercase text-foreground">{status.examTitle}</h3>
                <p className="font-bold text-zinc-600 uppercase text-sm">Durasi: {status.durationMin} Menit</p>
                <div className="bg-amber-50 border-2 border-amber-200 p-4 font-bold text-amber-800 text-xs">
                  ⚠️ PERINGATAN: Membuka tab lain atau meminimalkan browser akan dianggap sebagai pelanggaran dan dilaporkan ke panitia.
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-left max-w-xl mx-auto border-l-4 border-accent pl-6">
                <p className="font-bold text-zinc-600 uppercase text-sm leading-relaxed">
                  Akses terkunci karena:
                </p>
                <p className="font-black text-red-600 uppercase text-sm">{status?.reason}</p>
              </div>
            )}

            <Button 
              onClick={handleStartExam}
              disabled={!status?.canTakeExam || !isExamRunning} 
              className={`w-full max-w-md mx-auto h-16 border-4 shadow-none uppercase font-bold tracking-widest text-lg rounded-none mt-8 flex items-center justify-center gap-3 transition-all ${
                (status?.canTakeExam && isExamRunning)
                ? 'bg-accent text-foreground border-foreground hover:bg-foreground hover:text-white hover:scale-105 shadow-brutal-sm' 
                : 'bg-zinc-200 text-zinc-400 border-zinc-300 cursor-not-allowed'
              }`}
            >
              {!status?.canTakeExam 
                ? 'AKSES TERKUNCI' 
                : !isExamRunning 
                  ? 'MENUNGGU OPERATOR...' 
                  : 'MULAI UJIAN SEKARANG'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

