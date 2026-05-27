'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Shield, 
  Terminal, 
  Database, 
  Zap, 
  Activity, 
  Cpu, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  Plus, 
  ChevronRight,
  HardHat,
  HeartHandshake
} from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import AppSwal from '@/lib/swal';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({ totalOptions: 0, adminCount: 0, operatorCount: 0, userCount: 0, fundCount: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if(Array.isArray(data)) {
        setStats({
          totalOptions: data.length,
          adminCount: data.filter((u: any) => u.role === 'ADMIN').length,
          operatorCount: data.filter((u: any) => u.role === 'OPERATOR').length,
          userCount: data.filter((u: any) => u.role === 'USER').length,
          fundCount: data.filter((u: any) => u.role === 'FUNDRAISING').length,
        });
      }
    } catch (e) { console.error(e); }
    finally { setTimeout(() => setLoading(false), 500); }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      
      {/* 1. SUPREME COMMAND HEADER */}
      <header className="bg-white border-2 border-black p-8 md:p-12 rounded-[3.5rem] shadow-[6px_6px_0px_0px_#000] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] -translate-y-1/2 translate-x-1/4">
           <Cpu size={300} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-3 bg-[#CCFF00] border-2 border-black px-4 py-2 rounded-full mb-6 font-black text-[10px] uppercase tracking-[0.3em] shadow-[2px_2px_0px_0px_#000]">
               <ShieldCheck size={14} />
               SUPREME NODE ACCESS
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-black uppercase italic leading-[0.9]">
              NETWORK <br/>
              CONTROL ARCH.
            </h1>
            <p className="mt-6 font-bold text-zinc-400 uppercase tracking-widest text-xs italic max-w-2xl leading-relaxed">
               Highest level administrative oversight for the YMCC VII ecosystem infrastructure.
            </p>
          </div>
          <div className="flex gap-4">
             <button onClick={fetchStats} className="w-14 h-14 bg-white border-2 border-black rounded-3xl flex items-center justify-center shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
             </button>
             <Link href="/superadmin/users" className="bg-[#CCFF00] text-black border-2 border-black px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-3">
                <Plus size={16} /> MANAGE ENTITIES
             </Link>
          </div>
        </div>
      </header>

      {/* 2. ENTITY BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Total Network Connectivity Block */}
        <div className="lg:col-span-8 bg-[#EBF7D3] border-2 border-black rounded-[4rem] p-10 md:p-14 shadow-[8px_8px_0px_0px_#000] relative overflow-hidden">
           <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                 <Database size={24} className="text-black" />
                 <h3 className="font-black text-2xl uppercase tracking-tighter italic">Network Database Status</h3>
              </div>
              <div className="bg-white border-2 border-black px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_#000]">
                 Master Sync Active
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white border-2 border-black rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-[6px_6px_0px_0px_#000]">
                 <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 block italic">TOTAL ACCOUNT NODES:</span>
                 <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-[#CCFF00] border-2 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                       <Users size={32} />
                    </div>
                    <span className="text-7xl font-black italic tracking-tighter">{stats.totalOptions}</span>
                 </div>
              </div>

              <div className="bg-white border-2 border-black rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-[6px_6px_0px_0px_#000]">
                 <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 block italic">PARTICIPANT / USER:</span>
                 <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-black text-[#CCFF00] border-2 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                       <Users size={32} />
                    </div>
                    <span className="text-7xl font-black italic tracking-tighter">{stats.userCount}</span>
                 </div>
              </div>
           </div>

           {/* Security Band */}
           <div className="mt-12 bg-white border-2 border-black rounded-[3rem] p-8 flex flex-col md:flex-row items-center justify-between gap-10 shadow-[4px_4px_0px_0px_#000]">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-zinc-50 border-2 border-black rounded-3xl flex items-center justify-center">
                    <ShieldCheck size={32} className="text-green-500" />
                 </div>
                 <div>
                    <h5 className="font-black text-xs uppercase tracking-tight">Main Security Node: Verified</h5>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic leading-none">Global decryption active across all roles.</p>
                 </div>
              </div>
              <button 
                onClick={() => AppSwal.fire('SECURITY CHECK', 'All network nodes are consistent. No penetration detected.', 'success')}
                className="bg-black text-[#CCFF00] border-2 border-black px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                 AUDIT SYSTEM
              </button>
           </div>
        </div>

        {/* Roles Distribution Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           
           <div className="bg-white border-2 border-black rounded-[3.5rem] p-10 shadow-[8px_8px_0px_0px_#000] flex-grow">
              <div className="flex items-center justify-between mb-10">
                 <h4 className="font-black text-xl uppercase tracking-tighter italic">Entity Feed</h4>
                 <Activity size={20} />
              </div>

              <div className="space-y-4">
                 <SuperRoleItem icon={<Shield />} title="Admin Node" count={stats.adminCount} color="bg-zinc-100" />
                 <SuperRoleItem icon={<Terminal />} title="Operator Node" count={stats.operatorCount} color="bg-zinc-100" />
                 <SuperRoleItem icon={<HeartHandshake />} title="Fundraising" count={stats.fundCount} color="bg-[#CCFF00]" />
              </div>

              <div className="mt-12 pt-8 border-t border-zinc-50">
                 <Link href="/superadmin/users" className="w-full bg-[#CCFF00] text-black border-2 border-black py-5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-4 shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    Global User Registry <ChevronRight size={14} />
                 </Link>
              </div>
           </div>

           {/* Core Logic Status Block */}
           <div className="bg-black text-white border-2 border-black rounded-[3.5rem] p-12 shadow-[8px_8px_0px_0px_#CCFF00] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Zap size={140} className="text-[#CCFF00]" />
              </div>
              <div className="relative z-10">
                 <h4 className="text-3xl font-black uppercase tracking-tighter italic text-[#CCFF00] mb-6">Supreme Core.</h4>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                       <span className="text-[10px] font-black uppercase text-zinc-400">API Latency</span>
                       <span className="text-[10px] font-black text-[#CCFF00]">0.4ms</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                       <span className="text-[10px] font-black uppercase text-zinc-400">Auto Backup</span>
                       <span className="text-[10px] font-black text-green-500">ENABLED</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black uppercase text-zinc-400">Server Health</span>
                       <span className="text-[10px] font-black text-white">100% NOMINAL</span>
                    </div>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}

function SuperRoleItem({ icon, title, count, color }: any) {
  return (
    <div className="bg-zinc-50 border-2 border-black p-6 rounded-[2.5rem] flex items-center justify-between group hover:bg-white hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all cursor-pointer">
       <div className="flex items-center gap-5">
          <div className={`w-14 h-14 border-2 border-black rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_0px_#000] group-hover:bg-[#CCFF00] group-hover:text-black transition-all ${color}`}>
             {React.cloneElement(icon, { size: 24 })}
          </div>
          <div>
             <h5 className="font-black text-xs uppercase tracking-tight">{title}</h5>
             <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Active Hierarchy Node</p>
          </div>
       </div>
       <div className="text-right">
          <span className="text-2xl font-black italic tracking-tighter">{count}</span>
       </div>
    </div>
  );
}
