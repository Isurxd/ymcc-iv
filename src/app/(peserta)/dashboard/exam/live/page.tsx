'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '@/lib/supabase';

function LiveExamContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams.get('id');

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null); 
  const [violations, setViolations] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const violationRef = useRef(0);
  const userRef = useRef<any>(null);
  const answersRef = useRef<Record<string, string>>({});
  const endTimeRef = useRef<number | null>(null);
  const channelRef = useRef<any>(null);
  const syncTimerRef = useRef<any>(null);

  // Sync refs
  useEffect(() => { userRef.current = user; }, [user]);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  useEffect(() => {
    if (!examId) {
      router.push('/dashboard/exam');
      return;
    }

    // SUPABASE REALTIME SUBSCRIPTION
    const channel = supabase
      .channel(`exam_${examId}`)
      .on(
        'postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'Exam', filter: `id=eq.${examId}` }, 
        (payload) => {
          const updatedExam = payload.new as any;
          if (!updatedExam.isLive) {
            Swal.fire({
              title: 'UJIAN DIHENTIKAN',
              text: 'Operator telah memberhentikan atau mereset status ujian.',
              icon: 'warning',
              allowOutsideClick: false,
              confirmButtonText: 'KEMBALI'
            }).then(() => { router.push('/dashboard/exam'); });
          } else {
            // Re-sync timer if there's a change
            if (updatedExam.liveStartedAt) {
               endTimeRef.current = new Date(updatedExam.liveStartedAt).getTime() + (updatedExam.durationMin * 60 * 1000);
            }
          }
        }
      )
      .subscribe();
    
    channelRef.current = channel;

    const fetchData = async () => {
      try {
        const [qRes, meRes, statusRes, liveRes] = await Promise.all([
          fetch(`/api/participant/exam-questions/${examId}`),
          fetch('/api/auth/me'),
          fetch('/api/participant/exam-status'),
          fetch(`/api/participant/exam-live-detail?id=${examId}`) // New endpoint for live fields
        ]);
        
        const qData = await qRes.json();
        const meData = await meRes.json();
        const statusData = await statusRes.json();
        const liveData = await liveRes.json();
        
        if (!liveData.isLive) {
          router.push('/dashboard/exam');
          return;
        }

        setQuestions(qData);
        setUser(meData.user);

        // Resume Logic: Merge Server + LocalStorage (With Decryption)
        let localData: any = {};
        const stored = localStorage.getItem(`exam_${examId}`);
        if (stored) {
          try {
            localData = JSON.parse(decodeURIComponent(escape(atob(stored))));
          } catch (e) { console.error("Stored data corrupt", e); }
        }
        const serverData = statusData.existingAttempt || {};
        
        const mergedAnswers = { ...serverData.answers, ...localData.answers };
        setAnswers(mergedAnswers);
        
        const currentVios = Math.max(serverData.cheatCount || 0, localData.violations || 0);
        setViolations(currentVios);
        violationRef.current = currentVios;

        // Timer Logic: SYNC WITH DB MASTER TIMER
        if (liveData.liveStartedAt) {
          endTimeRef.current = new Date(liveData.liveStartedAt).getTime() + (liveData.durationMin * 60 * 1000);
        } else {
          const startTime = serverData.startTime ? new Date(serverData.startTime).getTime() : Date.now();
          const durationMs = (statusData.durationMin || 60) * 60 * 1000;
          endTimeRef.current = startTime + durationMs;
        }
        
        setHasStarted(true);
      } catch (err) {
        console.error("Fetch Data Error:", err);
      }
    };
    fetchData();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [examId]);

  // Robust Timer Engine
  useEffect(() => {
    if (!hasStarted || !endTimeRef.current) return;

    const tick = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTimeRef.current! - now) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        handleAutoSubmit();
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [hasStarted]);

  // Fail-Safe Persistence: Save to LocalStorage (Obfuscated)
  useEffect(() => {
    if (!hasStarted) return;
    const data = { answers, violations };
    // Simple Base64 "Encryption" as per request for 'encrypted format'
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    localStorage.setItem(`exam_${examId}`, payload);
  }, [answers, violations, hasStarted]);

  // Debounced Batch Sync to Server (Min 3s delay) - Bab 2.1.2
  useEffect(() => {
    if (!hasStarted) return;

    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
 
    syncTimerRef.current = setTimeout(async () => {
      try {
        await fetch('/api/participant/exam-save-progress', {
          method: 'POST',
          body: JSON.stringify({ examId, answers: answersRef.current })
        });
      } catch (e) {
        console.error("Debounced sync fail", e);
      }
    }, 3000); // 3 seconds debounce
 
    return () => { if (syncTimerRef.current) clearTimeout(syncTimerRef.current); };
  }, [answers, hasStarted]);

  const handleAutoSubmit = () => {
    Swal.fire({
      title: 'WAKTU HABIS!',
      text: 'Jawaban Anda akan dikirim otomatis.',
      icon: 'info',
      timer: 3000,
      showConfirmButton: false
    }).then(() => submitToApi());
  };

  useEffect(() => {
    const handleViolation = async () => {
      if (!hasStarted) return;
      const activeUser = userRef.current;
      const newVios = violationRef.current + 1;
      violationRef.current = newVios;
      setViolations(newVios);

      // Notify Server Immediately
      try {
        const res = await fetch('/api/participant/exam-violation', {
          method: 'POST',
          body: JSON.stringify({ examId })
        });
        const data = await res.json();
        
        if (data.disqualified) {
          Swal.fire({
            title: 'DISKUALIFIKASI!',
            text: 'Batas pelanggaran terlampaui. Ujian dihentikan.',
            icon: 'error',
            allowOutsideClick: false
          }).then(() => submitToApi());
          return;
        }
      } catch (e) { console.error("Violation sync fail", e); }

      // Broadcast via Supabase
      channelRef.current?.send({
        type: 'broadcast',
        event: 'TAB_SWITCH_DETECTED',
        payload: {
          id: activeUser?.email || 'Anonymous',
          name: activeUser?.name || 'Peserta',
          vios: newVios,
        }
      });

      // Standard Warning
      Swal.fire({
        title: 'PERINGATAN!',
        text: `Terdeteksi keluar layar! Pelanggaran ke-${newVios}/3.`,
        icon: 'warning',
        confirmButtonColor: '#001F3F'
      });
    };

    const handleFocusLoss = () => handleViolation();
    window.addEventListener('blur', handleFocusLoss);
    document.addEventListener('visibilitychange', () => { if (document.hidden) handleViolation(); });

    return () => {
      window.removeEventListener('blur', handleFocusLoss);
      document.removeEventListener('visibilitychange', handleFocusLoss);
    };
  }, [hasStarted]);

  const submitToApi = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await fetch('/api/participant/exam-submit', {
        method: 'POST',
        body: JSON.stringify({
          examId,
          answers: answersRef.current,
          cheatCount: violationRef.current
        })
      });

      localStorage.removeItem(`exam_${examId}`);
      await Swal.fire({ title: 'BERHASIL', text: 'Jawaban tersimpan.', icon: 'success' });
      router.push('/dashboard/exam');
    } catch (err) {
      Swal.fire('Error', 'Gagal mengirim.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const result = await Swal.fire({
      title: 'Tutup Ujian?',
      text: 'Pastikan sudah yakin.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'YA',
      cancelButtonText: 'TIDAK'
    });
    if (result.isConfirmed) await submitToApi();
  };

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!hasStarted) return <div className="p-20 text-center font-bold">LOADING...</div>;

  const currentQuestion = questions[currentIdx];

  return (
    <div className="min-h-screen bg-zinc-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <Card className="rounded-none border-4 border-foreground shadow-brutal-lg">
            <CardHeader className="bg-foreground text-white p-6 border-b-4 border-foreground">
              <div className="flex justify-between items-center">
                <span className="font-bold uppercase tracking-widest text-zinc-400">Soal {currentIdx + 1} / {questions.length}</span>
                <div className="bg-red-500 px-3 py-1 text-xs font-black animate-pulse">MONITORING AKTIF</div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <h2 className="text-2xl font-bold leading-relaxed text-zinc-800">{currentQuestion.content}</h2>
              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((opt: string, i: number) => {
                  const label = String.fromCharCode(65 + i);
                  const isSelected = answers[currentQuestion.id] === label;
                  return (
                    <button
                      key={i}
                      onClick={() => setAnswers({...answers, [currentQuestion.id]: label})}
                      className={`text-left p-6 border-4 font-bold transition-all flex items-center gap-4 ${
                        isSelected ? 'bg-accent border-foreground translate-x-1' : 'bg-white border-zinc-200 hover:border-foreground'
                      }`}
                    >
                      <span className={`w-10 h-10 flex items-center justify-center border-2 border-foreground ${isSelected ? 'bg-foreground text-white' : 'bg-zinc-100'}`}>{label}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between pt-8 border-t-4 border-dashed border-zinc-100">
                <Button disabled={currentIdx === 0} onClick={() => setCurrentIdx(currentIdx - 1)} className="rounded-none border-4 border-foreground bg-white text-foreground font-black">SEBELUMNYA</Button>
                {currentIdx < questions.length - 1 
                  ? <Button onClick={() => setCurrentIdx(currentIdx + 1)} className="rounded-none border-4 border-foreground bg-foreground text-white font-black">SELANJUTNYA</Button>
                  : <Button onClick={handleSubmit} className="rounded-none border-4 border-foreground bg-green-500 text-white font-black">KUMPULKAN</Button>
                }
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:w-80 space-y-6">
          <Card className="rounded-none border-4 border-foreground shadow-brutal-lg bg-white">
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="font-bold text-zinc-500 uppercase text-xs">Sisa Waktu</p>
                <div className="text-4xl font-black font-mono flex items-center justify-center gap-2 text-[#001F3F]">
                  <Clock className="w-8 h-8" /> {formatTime(timeLeft)}
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t-2 border-zinc-100">
                <p className="font-bold text-zinc-500 uppercase text-xs text-center">Navigasi</p>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, i) => (
                    <button key={i} onClick={() => setCurrentIdx(i)} className={`h-10 border-2 font-bold flex items-center justify-center ${currentIdx === i ? 'bg-accent border-foreground' : (answers[q.id] ? 'bg-zinc-800 text-white' : 'bg-white border-zinc-200')}`}>{i + 1}</button>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t-2 border-zinc-100 text-center">
                <div className={`inline-flex items-center gap-2 font-bold uppercase text-xs ${violations > 0 ? 'text-red-600' : 'text-zinc-400'}`}>
                  <ShieldAlert className="w-4 h-4" /> Pelanggaran: {violations}/3
                </div>
              </div>
            </CardContent>
          </Card>
          <Button onClick={handleSubmit} className="w-full h-16 bg-red-600 text-white font-black border-4 border-foreground shadow-brutal-sm rounded-none uppercase tracking-widest hover:bg-black transition-colors">AKHIRI UJIAN</Button>
        </div>
      </div>
    </div>
  );
}

export default function LiveExamPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold uppercase tracking-widest animate-pulse">MEMUAT ENGINE UJIAN...</div>}>
      <LiveExamContent />
    </Suspense>
  );
}

