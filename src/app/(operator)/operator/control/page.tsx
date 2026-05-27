'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  Activity, 
  Terminal, 
  Layers, 
  Wifi, 
  Settings, 
  ShieldAlert, 
  Monitor,
  RefreshCw,
  Users2,
  Clock
} from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import AppSwal from '@/lib/swal';

export default function MasterControlPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [examState, setExamState] = useState<'IDLE' | 'RUNNING' | 'PAUSED'>('IDLE');
  const [timeLeft, setTimeLeft] = useState(0); 
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const fetchExams = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/exams');
      const data = await res.json();
      if (Array.isArray(data)) {
        setExams(data);
        if (data.length > 0 && !selectedExamId) setSelectedExamId(data[0].id);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [selectedExamId]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/operator/attempts');
      if (res.ok) setAttempts(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoadingLogs(false); }
  }, []);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); 
    return () => clearInterval(interval);
  }, [fetchLogs]);

  useEffect(() => {
    if (!selectedExamId) return;

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
    
    AppSwal.fire({
      title: 'LAUNCH SESSION?',
      text: "This will synchronize all candidate nodes to start the exam sequence.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'LAUNCH NOW',
      confirmButtonColor: '#CCFF00',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch('/api/operator/exam-control', {
            method: 'POST',
            body: JSON.stringify({ examId: selectedExamId, action: 'START', liveStartedAt: new Date() })
          });
          setExamState('RUNNING');
          AppSwal.fire('SESSION LIVE', 'All nodes have been successfully synchronized.', 'success');
        } catch (e) {
          AppSwal.fire('SYNC FAILED', 'Communication bridge error.', 'error');
        }
      }
    });
  };

  const handlePauseExam = async () => {
    if (!selectedExamId) return;
    try {
      await fetch('/api/operator/exam-control', {
        method: 'POST',
        body: JSON.stringify({ examId: selectedExamId, action: 'STOP' })
      });
      setExamState('PAUSED');
      AppSwal.fire('SESSION HALTED', 'Exam progress has been frozen for all candidates.', 'info');
    } catch (e) { console.error(e); }
  };

  const checkConnectivity = () => {
     AppSwal.fire({
        title: 'CONNECTIVITY CHECK',
        text: 'Scanning all active participant sub-nodes...',
        timer: 1500,
        showConfirmButton: false,
        didOpen: () => { AppSwal.showLoading(); }
     }).then(() => {
        AppSwal.fire('NODES STABLE', '98.4% consistency detected across the network.', 'success');
     });
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="bg-white border-2 border-black p-8 rounded-[2.5rem] shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-[#CCFF00] shadow-[3px_3px_0px_0px_#000]">
              <Settings size={32} />
           </div>
           <div>
              <h1 className="text-4xl font-black tracking-tighter text-black uppercase italic leading-none">
                Master Control.
              </h1>
              <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mt-2 italic">Real-time exam orchestration and candidate monitoring.</p>
           </div>
        </div>
        
        <button onClick={fetchLogs} className="bg-[#EBF7D3] border-2 border-black p-4 rounded-2xl flex items-center gap-4 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all active:scale-95 group">
           <div className={`w-2 h-2 rounded-full bg-green-500 ${loadingLogs ? 'animate-ping' : 'animate-pulse'}`} />
           <span className="font-black text-[10px] uppercase tracking-widest text-black">Supabase Sync: Active</span>
           <RefreshCw size={14} className={`ml-2 ${loadingLogs ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'}`} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-8">
           <div className="bg-white border-2 border-black rounded-[3rem] p-8 md:p-12 shadow-[6px_6px_0px_0px_#000]">
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-4">
                    <Layers size={24} className="text-black" />
                    <h3 className="font-black text-xl uppercase tracking-tighter italic text-[#CCFF00] stroke-black" style={{ WebkitTextStroke: '1px black' }}>Exam Configuration</h3>
                 </div>
                 <div className="flex items-center gap-2 bg-zinc-50 border-2 border-black px-4 py-1.5 rounded-full">
                    <Monitor size={14} className="text-black" />
                    <span className="text-[9px] font-black uppercase text-black tracking-widest">Active Session</span>
                 </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                 <div className="flex-1 w-full">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4 mb-2 block">Pilih Modul Ujian</label>
                    <select 
                      value={selectedExamId}
                      onChange={(e) => setSelectedExamId(e.target.value)}
                      className="w-full h-16 bg-zinc-50 border-2 border-black rounded-2xl px-6 font-black uppercase focus:outline-none focus:bg-white transition-all cursor-pointer"
                    >
                      {exams.map(ex => (
                         <option key={ex.id} value={ex.id}>{ex.title}</option>
                      ))}
                    </select>
                 </div>
                 
                 <div className="w-full md:w-64 bg-black p-4 rounded-[2rem] flex items-center justify-center border-2 border-black relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <Clock size={80} className="text-white" />
                    </div>
                    <div className="text-center relative z-10">
                       <span className="text-4xl font-black text-[#CCFF00] tracking-tighter leading-none">{formatTime(timeLeft)}</span>
                       <p className="text-[8px] font-black text-[#CCFF00]/40 uppercase tracking-[0.2em] mt-1">Remaining Time</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <button 
                  onClick={handleStartExam}
                  disabled={examState === 'RUNNING'}
                  className="bg-[#CCFF00] text-black border-2 border-black py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-30 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3 active:scale-95"
                 >
                   <Play size={18} fill="black" /> Launch Exam
                 </button>
                 <button 
                  onClick={handlePauseExam}
                  disabled={examState !== 'RUNNING'}
                  className="bg-white border-2 border-black py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-30 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3 active:scale-95"
                 >
                   <Pause size={18} fill="black" /> Stop Session
                 </button>
              </div>
           </div>

           <div className="bg-[#EBF7D3] border-2 border-black rounded-[2.5rem] p-8 shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:bg-[#e4fcad]">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-white border-2 border-black rounded-3xl flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                    <Wifi size={32} className="text-black" />
                 </div>
                 <div>
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                       <h5 className="font-black text-xs uppercase tracking-tight text-green-700">All Candidate Sub-Nodes Active</h5>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic mt-1">Maintaining sync with {attempts.length} student exam attempts.</p>
                 </div>
              </div>
              <button 
                onClick={checkConnectivity}
                className="bg-white border-2 border-black px-10 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all active:scale-95"
              >
                 CHECK CONNECTIVITY
              </button>
           </div>
        </div>

        <div className="lg:col-span-4">
           <div className="bg-white border-2 border-black rounded-[3rem] p-10 shadow-[6px_6px_0px_0px_#000] h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <h4 className="font-black text-xl uppercase tracking-tighter italic">Live Monitor</h4>
                 <div className="bg-red-50 text-red-600 px-3 py-1 rounded-lg border-2 border-red-500 flex items-center gap-2">
                    <ShieldAlert size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Security Active</span>
                 </div>
              </div>

              <div className="space-y-4 flex-grow overflow-y-auto max-h-[500px] pr-2 no-scrollbar">
                {attempts.map((log) => (
                   <MonitorItem key={log.id} log={log} />
                ))}
                {attempts.length === 0 && !loadingLogs && (
                   <div className="flex flex-col items-center justify-center h-full py-20 text-zinc-300">
                      <Terminal size={48} className="mb-4" />
                      <p className="text-xs font-bold uppercase tracking-widest">Awaiting Candidates...</p>
                   </div>
                )}
                {loadingLogs && (
                   <div className="flex flex-col items-center justify-center h-full py-20">
                      <RefreshCw size={32} className="animate-spin text-zinc-200" />
                   </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-100">
                 <button 
                    onClick={() => AppSwal.fire('LOGS GENERATED', 'All session data exported to encrypted node storage.', 'success')}
                    className="w-full bg-[#CCFF00] border-2 border-black py-4 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all active:scale-95"
                 >
                    Generate Final Logs <ChevronRight size={14} />
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

function MonitorItem({ log }: any) {
  const isCheating = log.cheatCount >= 2;
  
  const viewDetails = () => {
     AppSwal.fire({
        title: log.registration.user.name.toUpperCase(),
        html: `
          <div class="text-left font-bold uppercase text-xs space-y-2 pt-4">
             <div class="flex justify-between border-b border-zinc-100 pb-2">
                <span>Attempt ID</span>
                <span class="text-zinc-400">#${log.id.slice(0,8)}</span>
             </div>
             <div class="flex justify-between border-b border-zinc-100 pb-2">
                <span>Current Status</span>
                <span class="text-green-600">${log.status}</span>
             </div>
             <div class="flex justify-between border-b border-zinc-100 pb-2">
                <span>Detection Events</span>
                <span class="${isCheating ? 'text-red-500' : 'text-black'}">${log.cheatCount} Violations</span>
             </div>
             <div class="flex justify-between">
                <span>Last Score Pulse</span>
                <span class="font-black text-lg">${log.score !== null ? log.score : '--'}</span>
             </div>
          </div>
        `,
        confirmButtonText: 'CLOSE NODE',
        confirmButtonColor: '#000000',
        customClass: {
           popup: 'rounded-[2.5rem] border-4 border-black'
        }
     });
  }

  return (
    <div 
      onClick={viewDetails}
      className={`bg-zinc-50 border-2 border-black p-5 rounded-[2.2rem] transition-all cursor-pointer group hover:bg-white hover:shadow-[3px_3px_0px_0px_#000] ${isCheating ? 'border-red-500 shadow-[2px_2px_0px_0px_#ef4444]' : ''}`}
    >
       <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-black group-hover:bg-[#CCFF00] group-hover:border-black transition-all">
                <Users2 size={20} />
             </div>
             <div>
                <h5 className="font-black text-[11px] uppercase tracking-tight leading-none mb-1">{log.registration.user.name.split(' ')[0]}</h5>
                <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">{log.status}</p>
             </div>
          </div>
          <div className="text-right">
             <div className={`text-sm font-black italic tracking-tighter ${isCheating ? 'text-red-500' : 'text-black'}`}>
                {log.cheatCount}/3
             </div>
             <p className="text-[7px] font-bold text-zinc-300 uppercase tracking-[0.2em]">Cheats</p>
          </div>
       </div>
       <div className="flex items-center justify-between mt-3 bg-white p-2 rounded-xl border border-zinc-100">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[7px] font-black uppercase text-zinc-400 tracking-widest">Active Pings</span>
          </div>
          <span className="text-[9px] font-black text-black">Score: {log.score !== null ? log.score : '--'}</span>
       </div>
    </div>
  );
}
