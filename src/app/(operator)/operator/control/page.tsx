'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, ChevronRight, Activity, Terminal, Layers } from 'lucide-react';

export default function MasterControlPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [examState, setExamState] = useState<'IDLE' | 'RUNNING' | 'PAUSED'>('IDLE');
  const [timeLeft, setTimeLeft] = useState(0); 
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch Exams List
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch('/api/admin/exams'); // Assuming this exists or returns exams
        const data = await res.json();
        if (Array.isArray(data)) {
          setExams(data);
          if (data.length > 0) setSelectedExamId(data[0].id);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchExams();
  }, []);

  // Sync with Database Realtime
  useEffect(() => {
    if (!selectedExamId) return;

    // Initial Fetch for selected exam state
    const fetchExamDetail = async () => {
      const res = await fetch(`/api/participant/exam-live-detail?id=${selectedExamId}`);
      if (res.ok) {
        const data = await res.json();
        updateLocalState(data);
      }
    };
    fetchExamDetail();

    const channel = supabase
      .channel('master_control')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'Exam', filter: `id=eq.${selectedExamId}` },
        (payload) => {
          updateLocalState(payload.new);
        }
      )
      .subscribe();

    return () => {
       supabase.removeChannel(channel);
    };
  }, [selectedExamId]);

  const updateLocalState = (data: any) => {
    if (data.isLive && data.liveStartedAt) {
      setExamState('RUNNING');
      const startTimestamp = new Date(data.liveStartedAt).getTime();
      const durationSeconds = data.durationMin * 60;
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
      setTimeLeft(Math.max(0, durationSeconds - elapsed));
      setDuration(durationSeconds);
    } else {
      setExamState('IDLE');
      setTimeLeft(data.durationMin * 60);
      setDuration(data.durationMin * 60);
    }
  };

  // Global Timer UI Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (examState === 'RUNNING' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setExamState('IDLE');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examState, timeLeft]);

  const handleStartExam = async () => {
    if (!selectedExamId) return;
    try {
      await fetch('/api/operator/exam-control', {
        method: 'POST',
        body: JSON.stringify({ examId: selectedExamId, action: 'START', liveStartedAt: new Date() })
      });
      setExamState('RUNNING');
    } catch (e) { console.error(e); }
  };

  const handlePauseExam = async () => {
    if (!selectedExamId) return;
    try {
      await fetch('/api/operator/exam-control', {
        method: 'POST',
        body: JSON.stringify({ examId: selectedExamId, action: 'STOP' })
      });
      setExamState('PAUSED');
    } catch (e) { console.error(e); }
  };

  const [attempts, setAttempts] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/operator/attempts');
      if (res.ok) setAttempts(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoadingLogs(false); }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); 
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="border-b-4 border-foreground pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-wide text-[#001F3F]">
            MASTER CONTROL PNL.
          </h1>
          <p className="text-lg text-zinc-600 font-bold border-l-4 border-accent pl-4 mt-2 uppercase tracking-wide">
            CENTRAL EXAM MONITORING & CONTROL
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#CCFF00] border-4 border-foreground px-6 py-3 font-black uppercase shadow-[4px_4px_0_#000]">
          <Activity className="w-5 h-5" />
          SUPABASE SYNC: <span className="text-foreground">ONLINE</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Module Selection */}
        <div className="lg:col-span-3">
           <Card className="bg-white border-4 border-foreground shadow-[8px_8px_0_0_#000] rounded-none">
              <CardContent className="p-6 flex items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                    <div className="bg-foreground text-white p-3">
                       <Layers className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase text-zinc-400">AKTIFKAN MODUL UJIAN</p>
                       <h2 className="text-xl font-black uppercase">Pilih Sesi Ujian</h2>
                    </div>
                 </div>
                 <select 
                    value={selectedExamId}
                    onChange={(e) => setSelectedExamId(e.target.value)}
                    className="flex-1 max-w-md h-12 border-4 border-foreground rounded-none px-4 font-black uppercase focus:ring-0 appearance-none bg-zinc-50 cursor-pointer"
                 >
                    {exams.map(ex => (
                       <option key={ex.id} value={ex.id}>{ex.title}</option>
                    ))}
                 </select>
                 <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-zinc-400">STATUS MODUL</p>
                    <p className={`font-black uppercase ${examState === 'RUNNING' ? 'text-green-600' : 'text-red-500'}`}>
                       {examState === 'RUNNING' ? '🟢 SEDANG BERLANGSUNG' : '🔴 NON-AKTIF'}
                    </p>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Timer Card */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-4 border-foreground shadow-brutal-lg rounded-none h-full">
            <CardHeader className="bg-primary border-b-4 border-foreground p-6">
              <CardTitle className="text-xl font-black uppercase text-white flex items-center gap-3">
                <Activity className="w-6 h-6" /> GLOBAL TIMER
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
               <div className="bg-zinc-100 border-4 border-foreground w-full py-10 text-center">
                 <span className="text-6xl font-black uppercase text-[#001F3F] font-mono">
                   {formatTime(timeLeft)}
                 </span>
                 <div className="mt-4">
                   <span className={`px-4 py-1 text-white font-bold uppercase text-xs ${examState === 'RUNNING' ? 'bg-green-600 animate-pulse' : 'bg-red-500'}`}>
                     {examState}
                   </span>
                 </div>
               </div>

               <div className="flex flex-col gap-4">
                 <Button 
                  onClick={handleStartExam}
                  disabled={examState === 'RUNNING'}
                  className="w-full h-16 text-lg font-black uppercase bg-accent hover:bg-orange-500 text-foreground border-4 border-foreground shadow-brutal-sm hover:-translate-y-1 transition-all rounded-none gap-3"
                 >
                   <Play className="w-6 h-6" /> START
                 </Button>
                 <Button 
                  onClick={handlePauseExam}
                  disabled={examState !== 'RUNNING'}
                  className="w-full h-16 text-lg font-black uppercase bg-zinc-200 hover:bg-zinc-300 text-foreground border-4 border-foreground shadow-brutal-sm hover:-translate-y-1 transition-all rounded-none gap-3"
                 >
                   <Pause className="w-6 h-6" /> PAUSE
                 </Button>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Monitor Table */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-4 border-foreground shadow-brutal-lg rounded-none h-full">
            <CardHeader className="bg-foreground text-white border-b-4 border-foreground p-6">
              <CardTitle className="text-xl font-black uppercase flex items-center justify-between">
                <span>CANDIDATE LIVE MONITOR</span>
                <span className="text-[10px] bg-green-500 px-2 py-1 border border-zinc-800">REAL-TIME SYNC</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[600px] overflow-y-auto">
              {loadingLogs ? (
                <div className="p-20 text-center font-bold">LOADING LOGS...</div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-zinc-100 border-b-4 border-foreground sticky top-0">
                    <tr>
                      <th className="p-4 font-black text-xs uppercase">PESERTA</th>
                      <th className="p-4 font-black text-xs uppercase text-center">STATUS</th>
                      <th className="p-4 font-black text-xs uppercase text-center">CHEATS</th>
                      <th className="p-4 font-black text-xs uppercase text-center">SKOR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-zinc-100">
                    {attempts.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="p-4">
                          <p className="font-black text-sm uppercase">{log.registration.user.name}</p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase">{log.registration.user.email}</p>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-1 text-[10px] font-black border-2 ${
                            log.status === 'COMPLETED' ? 'bg-green-100 border-green-600 text-green-600' :
                            log.status === 'DISQUALIFIED' ? 'bg-red-100 border-red-600 text-red-600' :
                            'bg-blue-100 border-blue-600 text-blue-600'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`font-black ${log.cheatCount >= 2 ? 'text-red-600 animate-bounce' : 'text-foreground'}`}>
                            {log.cheatCount}/3
                          </span>
                        </td>
                        <td className="p-4 text-center font-black">
                          {log.score !== null ? log.score : '--'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


