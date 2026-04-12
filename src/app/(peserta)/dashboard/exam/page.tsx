'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Lock, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSocket } from '@/lib/socket-client';

export default function ExamPage() {
  const [user, setUser] = useState<any>(null);
  const violationCountRef = useRef(0);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!user) return;

    let timeout: NodeJS.Timeout | null = null;
    
    const handleViolation = () => {
      if (timeout) return; // Prevent double trigger (blur + visibilitychange)
      
      violationCountRef.current += 1;
      const socket = getSocket();
      
      // Emit to server (which broadcasts to cheat-monitor)
      socket.emit('TAB_SWITCH_DETECTED', {
        id: user.email || user.id, // Fallback identity
        name: user.name,
        vios: violationCountRef.current,
      });

      alert(`[SYSTEM WARNING]\n\nPelanggaran terdeteksi: Anda keluar dari layar ujian CBT!\nTeguran ke-${violationCountRef.current}. Aktivitas ini telah direkam oleh Master Control Panel.`);

      timeout = setTimeout(() => {
        timeout = null;
      }, 3000);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) handleViolation();
    };

    const handleBlur = () => {
      handleViolation();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      if (timeout) clearTimeout(timeout);
    };
  }, [user]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-l-[12px] border-amber-400 bg-white p-8 shadow-brutal-lg border-4 border-foreground relative overflow-hidden">
        <h1 className="text-4xl md:text-5xl font-heading font-black italic uppercase tracking-tight text-foreground relative z-10 drop-shadow-[4px_4px_0_var(--color-accent)] [-webkit-text-stroke:1px_var(--color-foreground)]">
          PORTAL UJIAN (E-CBT)
        </h1>
        <p className="mt-4 font-bold text-zinc-600 uppercase tracking-widest max-w-2xl text-sm leading-relaxed">
          Sistem Ujian Berbasis Komputer. Hanya dapat diakses ketika registrasi disetujui dan jadwal ujian resmi telah dimulai oleh Operator Pusat.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
        <Card className="bg-white border-4 border-foreground shadow-[16px_16px_0_0_var(--color-foreground)] rounded-none">
          <CardHeader className="border-b-4 border-foreground bg-[#001F3F] p-8 text-center">
            <ShieldAlert className="w-16 h-16 text-accent mx-auto mb-4" />
            <CardTitle className="font-heading italic uppercase text-3xl md:text-4xl text-white">
              SISTEM MASIH TERKUNCI
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 md:p-12 text-center space-y-8">
            
            <div className="bg-zinc-100 border-4 border-zinc-200 p-6 max-w-lg mx-auto">
              <p className="font-bold text-lg text-zinc-500 uppercase tracking-widest mb-2">STATUS TIM ANDA</p>
              <h2 className="font-heading italic text-3xl text-red-500 uppercase">BELUM TERVERIFIKASI</h2>
            </div>
            
            <div className="space-y-4 text-left max-w-xl mx-auto border-l-4 border-accent pl-6">
              <p className="font-bold text-zinc-600 uppercase text-sm leading-relaxed">
                Anda tidak bisa mengakses sistem ujian pada saat ini karena:
              </p>
              <ul className="list-disc pl-5 font-bold text-zinc-500 text-sm uppercase space-y-2">
                <li>Berkas tim belum dikumpulkan atau masih dalam peninjauan.</li>
                <li>Waktu ujian belum diinisisasi oleh Master Control Panel.</li>
              </ul>
            </div>

            <Button disabled className="w-full max-w-md mx-auto h-16 bg-zinc-300 text-zinc-500 border-4 border-transparent shadow-none uppercase font-bold tracking-widest text-lg rounded-none mt-8 flex items-center justify-center gap-3">
              <Lock className="w-5 h-5" /> EXAM ENGINE LOCKED
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
