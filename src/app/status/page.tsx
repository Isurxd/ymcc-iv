'use client';

import { motion } from 'framer-motion';
import { 
  Zap, 
  Activity, 
  Users2, 
  Trophy, 
  Globe, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import React from 'react';
import Link from 'next/link';

export default function PublicStatusPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F5] text-black font-poppins pb-32 pt-24">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
           <div>
              <div className="inline-flex items-center gap-3 bg-[#CCFF00] border-2 border-black px-4 py-2 rounded-full mb-6 font-black text-[10px] uppercase tracking-[0.3em] shadow-[4px_4px_0px_0px_#000]">
                 <span className="w-2 h-2 bg-black rounded-full animate-ping" />
                 LIVE NETWORK STATUS
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                YMCC VII <br/>
                <span className="text-[#CCFF00] text-stroke-black" style={{ WebkitTextStroke: '2px black' }}>REAL-TIME NODE.</span>
              </h1>
           </div>
           <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest max-w-xs italic leading-relaxed">
              Public monitoring of the YMCC VII global competition infrastructure and participation metrics.
           </p>
        </div>

        {/* 10000% PREMIUM BENTO GRID FOR PUBLIC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Global Count Widget */}
           <div className="lg:col-span-8 bg-[#EBF7D3] border-2 border-black rounded-[4rem] p-12 md:p-16 shadow-[8px_8px_0px_0px_#000] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
                 <Globe size={300} />
              </div>
              
              <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-12">
                    <Activity size={24} />
                    <h3 className="font-black text-2xl uppercase tracking-tighter italic">Participation Metrics</h3>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="bg-white border-2 border-black rounded-[3rem] p-10 shadow-[6px_6px_0px_0px_#000]">
                       <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 block">ACTIVE REGISTRATIONS:</span>
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-[#CCFF00] border-2 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                             <Users2 size={32} />
                          </div>
                          <span className="text-7xl font-black italic tracking-tighter">124</span>
                       </div>
                    </div>
                    <div className="bg-white border-2 border-black rounded-[3rem] p-10 shadow-[6px_6px_0px_0px_#000]">
                       <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 block">REGIONS REPRESENTED:</span>
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-black text-[#CCFF00] border-2 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                             <Globe size={32} />
                          </div>
                          <span className="text-7xl font-black italic tracking-tighter">15</span>
                       </div>
                    </div>
                 </div>

                 <div className="mt-12 bg-white border-2 border-black rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[4px_4px_0px_0px_#000]">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-zinc-50 border-2 border-black rounded-2xl flex items-center justify-center">
                          <ShieldCheck size={28} className="text-green-500" />
                       </div>
                       <div>
                          <h5 className="font-black text-xs uppercase tracking-tight">Mainframe Security: ON</h5>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic">All nodes synchronized via Supabase Command.</p>
                       </div>
                    </div>
                    <Link href="/register" className="bg-[#CCFF00] text-black border-2 border-black px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                       JOIN THE QUEUE
                    </Link>
                 </div>
              </div>
           </div>

           {/* Event Countdown Widget */}
           <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="bg-white border-2 border-black rounded-[4rem] p-12 shadow-[8px_8px_0px_0px_#000] flex-grow flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 bg-black text-[#CCFF00] border-2 border-black rounded-[2rem] flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_#000]">
                    <Clock size={40} />
                 </div>
                 <h4 className="font-black text-xl uppercase tracking-widest mb-2 italic text-zinc-400 font-poppins">T-MINUS</h4>
                 <div className="text-6xl font-black italic tracking-tighter mb-6 font-mono">24:00:00</div>
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300 max-w-[180px]">UNTIL MAIN EVALUATION SESSION COMMENCES.</p>
              </div>

              <div className="bg-black text-[#CCFF00] border-2 border-black rounded-[3.5rem] p-10 shadow-[6px_6px_0px_0px_#CCFF00] group cursor-pointer overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all -translate-y-4 translate-x-4">
                    <Trophy size={140} />
                 </div>
                 <h4 className="font-black text-2xl uppercase tracking-tighter italic mb-4 relative z-10 transition-transform group-hover:-translate-y-1">Prize Node Value</h4>
                 <div className="text-4xl font-black italic tracking-tighter text-white relative z-10">IDR 15.000.000+</div>
                 <div className="mt-8 flex items-center gap-3 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00]/40">Accumulated Pool</span>
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                 </div>
              </div>
           </div>

           {/* Infrastructure Roadmap (Public Info) */}
           <div className="lg:col-span-12 bg-white border-2 border-black rounded-[5rem] p-16 md:p-24 shadow-[10px_10px_0px_0px_#000]">
              <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10">
                 <div>
                    <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none text-[#CCFF00] stroke-black" style={{ WebkitTextStroke: '1.5px black' }}>Infrastructure <br/> Milestone.</h3>
                    <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mt-4 italic">Current evolutionary stage of the YMCC ecosystem.</p>
                 </div>
                 <div className="flex gap-10">
                    <div className="text-center">
                       <div className="text-4xl font-black italic tracking-tighter">98.4%</div>
                       <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Uptime Sync</p>
                    </div>
                    <div className="text-center">
                       <div className="text-4xl font-black italic tracking-tighter">05</div>
                       <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Active Stages</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
                 <div className="absolute top-10 left-0 w-full h-1 bg-zinc-100 hidden md:block" />
                 <StatusStep label="Phase 1: Reg" active />
                 <StatusStep label="Phase 2: Sync" active />
                 <StatusStep label="Phase 3: Eval" />
                 <StatusStep label="Phase 4: Finale" />
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}

function StatusStep({ label, active = false }: any) {
  return (
    <div className="flex flex-col items-center gap-6 relative z-10">
       <div className={`w-20 h-20 rounded-full border-2 border-black flex items-center justify-center transition-all ${active ? 'bg-[#CCFF00] shadow-[4px_4px_0px_0px_#000]' : 'bg-white opacity-20'}`}>
          <Cpu size={24} />
       </div>
       <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-black' : 'text-zinc-300'}`}>{label}</span>
    </div>
  );
}
