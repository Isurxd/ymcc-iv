'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Search, 
  Download, 
  ShieldAlert, 
  QrCode, 
  Zap, 
  Activity, 
  Monitor, 
  Cpu, 
  ArrowRight,
  Trophy,
  CheckCircle2,
  AlertCircle,
  FileText,
  LayoutGrid,
  ChevronRight,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import AppSwal from '@/lib/swal';
import { QRCodeSVG } from 'qrcode.react';

export default function DashboardPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/participant/exam-status');
      const data = await res.json();
      setStatus(data);

      if (data && data.canTakeExam === false && data.registrationStatus !== 'APPROVED') {
        // Only show if not already shown this session
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-black/10 rounded-full" />
          <div className="w-20 h-20 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
        </div>
      </div>
    );
  }

  const isVerified = status?.canTakeExam;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* 1. ELITE PARTICIPANT HEADER */}
      <header className="bg-white border-2 border-black p-8 md:p-12 rounded-[3.5rem] shadow-[6px_6px_0px_0px_#000] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] -translate-y-1/2 translate-x-1/4">
           <Zap size={300} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 bg-[#CCFF00] border-2 border-black px-4 py-2 rounded-full mb-6 font-black text-[10px] uppercase tracking-[0.3em] shadow-[2px_2px_0px_0px_#000]">
             {isVerified ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
             {isVerified ? 'NODE VERIFIED' : 'PENDING SYNC'}
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-black uppercase italic leading-[0.9]">
            PARTICIPANT <br/>
            COMMAND PORTAL.
          </h1>
          <p className="mt-6 font-bold text-zinc-400 uppercase tracking-widest text-xs italic max-w-2xl leading-relaxed">
            Welcome to the YMCC VII Executive Node. Monitor your team status and coordinate your exam sequence below.
          </p>
        </div>
      </header>

      {/* 2. BENTO FLOW (Exam & Support) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Exam Control Block */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           <div className={`bg-[#EBF7D3] border-2 border-black rounded-[3.5rem] p-10 md:p-14 shadow-[8px_8px_0px_0px_#000] relative overflow-hidden`}>
              <div className="flex items-center justify-between mb-12">
                 <div className="flex items-center gap-4">
                    <Activity size={24} className="text-black" />
                    <h3 className="font-black text-2xl uppercase tracking-tighter italic">EXAM ENGINE STATUS</h3>
                 </div>
                 <span className={`bg-white border-2 border-black px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_#000] ${isVerified ? 'text-green-600' : 'text-red-500'}`}>
                    {isVerified ? '🟢 READY FOR UPLINK' : '🔴 OFFLINE'}
                 </span>
              </div>
              
              <div className="bg-white border-2 border-black rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-[6px_6px_0px_0px_#000]">
                <div className="flex-1 space-y-6">
                   <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000] ${isVerified ? 'bg-[#CCFF00]' : 'bg-zinc-100'}`}>
                         <Monitor size={28} />
                      </div>
                      <div>
                         <h4 className="font-black text-lg uppercase tracking-tight italic">E-CBT Terminal</h4>
                         <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Global Competition Node v7.0</p>
                      </div>
                   </div>
                   <p className="text-sm font-bold text-zinc-500 uppercase leading-relaxed max-w-sm italic">
                      {isVerified 
                        ? 'Your node is fully synchronized. You may now enter the exam terminal to begin your evaluation.' 
                        : 'Your node is currently waiting for administrative verification before exam uplink can be established.'}
                   </p>
                </div>

                <div className="w-full md:w-auto">
                   {isVerified ? (
                     <Link href="/dashboard/exam" className="bg-[#CCFF00] text-black border-2 border-black px-12 py-6 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-4 group">
                        ENTER TERMINAL <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                     </Link>
                   ) : (
                     <button className="w-full bg-zinc-100 border-2 border-zinc-200 text-zinc-400 px-12 py-6 rounded-full font-black text-sm uppercase tracking-[0.2em] cursor-not-allowed opacity-50 border-dashed">
                        LOCKED
                     </button>
                   )}
                </div>
              </div>

              {/* Security Warning Panel */}
              <div className="mt-10 bg-black/5 border border-black/10 rounded-3xl p-6 flex items-center gap-6">
                 <ShieldAlert className="text-black/20" size={32} />
                 <p className="text-[9px] font-black uppercase text-black/30 tracking-[0.2em] italic max-w-sm leading-relaxed">
                    ANTI-CHEAT NODE ACTIVE: SYNCING PERSISTENT DATA ACROSS ALL ENDPOINTS. THREE VIOLATIONS WILL RESULT IN AUTO-DISQUALIFICATION.
                 </p>
              </div>
           </div>

           {/* Stats / Registration Status Row */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border-2 border-black rounded-[3rem] p-10 shadow-[6px_6px_0px_0px_#000] group hover:bg-zinc-50 transition-colors">
                 <div className="w-12 h-12 bg-zinc-100 border-2 border-black rounded-2xl flex items-center justify-center mb-8 shadow-[3px_3px_0px_0px_#000] group-hover:bg-[#CCFF00] transition-all">
                    <FileText size={24} />
                 </div>
                 <h5 className="font-black text-sm uppercase tracking-widest text-zinc-400 mb-2 italic">Registration Status</h5>
                 <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl font-black uppercase italic tracking-tighter">{status?.registrationStatus || 'PENDING'}</span>
                    <div className={`w-2 h-2 rounded-full ${isVerified ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`} />
                 </div>
                 <Link href="/dashboard/registration" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-[#CCFF00] transition-colors">
                    Re-Audit Documents <ChevronRight size={14} />
                 </Link>
              </div>

              <div className="bg-white border-2 border-black rounded-[3rem] p-10 shadow-[6px_6px_0px_0px_#000] group hover:bg-zinc-50 transition-colors">
                 <div className="w-12 h-12 bg-zinc-100 border-2 border-black rounded-2xl flex items-center justify-center mb-8 shadow-[3px_3px_0px_0px_#000] group-hover:bg-[#CCFF00] transition-all">
                    <Cpu size={24} />
                 </div>
                 <h5 className="font-black text-sm uppercase tracking-widest text-zinc-400 mb-2 italic">Node Configuration</h5>
                 <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl font-black uppercase italic tracking-tighter">YMCC-NODE-07</span>
                 </div>
                 <p className="text-[10px] font-black uppercase text-zinc-300 tracking-widest italic">Stable Uplink Established</p>
              </div>
           </div>
        </div>

        {/* Identity & Support Hub */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           
           {/* QR IDENTITY CARD */}
           <div className="bg-white border-2 border-black rounded-[4rem] p-12 shadow-[8px_8px_0px_0px_#000] text-center">
              <div className="inline-flex items-center gap-3 bg-[#CCFF00] border-2 border-black px-4 py-1.5 rounded-full mb-10 font-black text-[9px] uppercase tracking-widest shadow-[2px_2px_0px_0px_#000]">
                 <QrCode size={12} /> IDENTITY NODE
              </div>
              
              <div className="flex justify-center mb-10">
                 <div className="bg-white border-2 border-black p-6 rounded-[2.5rem] shadow-[10px_10px_0px_0px_#000] relative group">
                    <div className="absolute inset-0 bg-[#CCFF00] opacity-0 group-hover:opacity-10 transition-opacity rounded-[2.5rem]" />
                    <QRCodeSVG 
                      value={status?.registrationId || 'YMCC-PENDING'} 
                      size={180}
                      level="H"
                      includeMargin={false}
                    />
                 </div>
              </div>

              <h4 className="font-black text-xl uppercase tracking-tighter italic mb-3">DIGITAL TICKET</h4>
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.25em] leading-relaxed px-4">
                 IDENTITAS RESMI PESERTA YMCC VII. TUNJUKKAN KODE INI KEPADA PANITIA SAAT SESI PRESENSI OFFLINE.
              </p>
           </div>

           {/* SUPPORT & GUIDEBOOK CARD */}
           <div className="bg-black text-white border-2 border-black rounded-[3.5rem] p-12 shadow-[8px_8px_0px_0px_#CCFF00] flex-grow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Plus size={120} className="text-[#CCFF00]" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                 <h4 className="text-3xl font-black uppercase tracking-tighter italic text-[#CCFF00] mb-6">Operations Hub.</h4>
                 <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-10 opacity-60">Need technical assistance with your station?</p>
                 
                 <div className="space-y-4 mb-10">
                    <button 
                      onClick={() => AppSwal.fire({ title: 'GUIDEBOOK NODE', text: 'Document currently in final synchronization.', icon: 'info' })}
                      className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex items-center justify-between hover:bg-zinc-800 transition-all group"
                    >
                       <span className="font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
                          <Download size={14} className="group-hover:text-[#CCFF00] transition-colors" /> Technical PDF
                       </span>
                       <ChevronRight size={14} className="text-zinc-500" />
                    </button>
                    <Link 
                      href="/contact"
                      className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex items-center justify-between hover:bg-zinc-800 transition-all group"
                    >
                       <span className="font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
                          <ShieldAlert size={14} className="group-hover:text-red-500 transition-colors" /> Report Issue
                       </span>
                       <ChevronRight size={14} className="text-zinc-500" />
                    </Link>
                 </div>

                 <button 
                   onClick={() => AppSwal.fire({ title: 'SUPPORT CHAT', text: 'Opening encrypted link to YMCC HQ...', icon: 'success' })}
                   className="mt-auto w-full bg-[#CCFF00] text-black border-2 border-black py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                 >
                    INITIALIZE SUPPORT
                 </button>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
