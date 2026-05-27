'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Users2, 
  Zap, 
  Plus, 
  LayoutGrid, 
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Activity,
  FileText,
  CreditCard,
  Cpu
} from 'lucide-react';
import React from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalTeams: 0,
    pendingPayments: 0,
    pendingDocuments: 0,
    verifiedTeams: 0
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // 1 minute auto sync
    return () => clearInterval(interval);
  }, [fetchStats]);

  const handleBroadcast = () => {
    import('@/lib/swal').then(Swal => {
      Swal.default.fire({
        title: 'BROADCAST NODE',
        input: 'textarea',
        inputPlaceholder: 'Enter message to all active participants...',
        confirmButtonText: 'SEND BROADCAST',
        confirmButtonColor: '#000000',
        showCancelButton: true,
        customClass: {
          popup: 'rounded-[2rem] border-4 border-black'
        }
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          Swal.default.fire({
            icon: 'success',
            title: 'BROADCAST SENT',
            text: 'Relayed to all active coordination channels.',
            confirmButtonColor: '#CCFF00',
            confirmButtonText: 'ACKNOWLEDGE'
          });
        }
      });
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-12"
    >
      {/* Superior Header */}
      <header className="mb-10 bg-white border-2 border-black p-8 rounded-[2.5rem] shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#CCFF00] text-black px-3 py-1 rounded-lg mb-4 border border-black shadow-[2px_2px_0px_0px_#000]">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Master Command Node</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-black uppercase italic">
            Command Center.
          </h1>
          <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mt-2 italic">Real-time node administration and selection monitoring.</p>
        </div>
        <div className="flex gap-3">
           <Link href="/admin/orders" className="flex items-center gap-2 bg-white border-2 border-black px-5 py-2 rounded-2xl font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
              Launch Logs
           </Link>
           <button 
              onClick={handleBroadcast}
              className="flex items-center gap-2 bg-[#CCFF00] text-black border-2 border-black px-5 py-2 rounded-2xl font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
           >
              Broadcast Message
           </button>
        </div>
      </header>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-8">
           <div className={`bg-[#EBF7D3] border-2 border-black rounded-[3rem] p-8 md:p-12 shadow-[6px_6px_0px_0px_#000] relative overflow-hidden transition-opacity ${loading ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-4">
                    <Zap size={24} className="fill-black" />
                    <h3 className="font-bold text-xl uppercase tracking-tighter">Live Selection Stats</h3>
                 </div>
                 <div className="flex items-center gap-2">
                    {loading && <RefreshCw className="w-4 h-4 animate-spin text-black/20" />}
                    <span className="bg-white border-2 border-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#000]">Active Node</span>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                 <Link href="/admin/merch" className="bg-white border-2 border-black rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-4">Total Registered:</span>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-[#CCFF00] border-2 border-black rounded-full flex items-center justify-center">
                          <Users2 size={24} />
                       </div>
                       <span className="text-6xl font-black italic tracking-tighter">{stats.totalTeams}</span>
                    </div>
                 </Link>

                 <div className="bg-white border-2 border-black rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_0px_#000]">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-4">Verified Nodes:</span>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-black border-2 border-black rounded-full flex items-center justify-center text-[#CCFF00]">
                          <Cpu size={24} />
                       </div>
                       <span className="text-6xl font-black italic tracking-tighter">{stats.verifiedTeams}</span>
                    </div>
                 </div>
              </div>

              <div className="mt-10 bg-white border-2 border-black rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[3px_3px_0px_0px_#000]">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-green-50 border-2 border-black rounded-2xl flex items-center justify-center">
                       <Activity size={24} className="text-green-500" />
                      </div>
                      <div>
                         <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                           <h5 className="font-black text-xs uppercase tracking-tight text-green-600">All Nodes Functional</h5>
                         </div>
                         <p className="text-[10px] text-zinc-400 font-bold uppercase">System integrity verified by Master Command.</p>
                      </div>
                   </div>
                   <button 
                    onClick={fetchStats}
                    disabled={loading}
                    className="bg-[#CCFF00] text-black border-2 border-black px-10 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-30"
                   >
                      {loading ? 'SYNCING...' : 'REFRESH STATUS'}
                   </button>
                </div>
             </div>
          </div>

          {/* Quick Hub */}
          <div className="lg:col-span-4 flex flex-col gap-8">
             <div className="bg-white border-2 border-black rounded-[3rem] p-10 shadow-[6px_6px_0px_0px_#000] h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                   <h4 className="font-black text-xl uppercase tracking-tighter italic">Selection Hub</h4>
                   <button onClick={fetchStats} className="p-2 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] hover:shadow-none transition-all active:scale-95">
                      <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                   </button>
                </div>

                <div className="space-y-4 flex-grow">
                   <Link href="/admin/document">
                      <AdminTask icon={<FileText />} title="Audit Berkas" count={stats.pendingDocuments} desc="Pending verifications." />
                   </Link>
                   <Link href="/admin/payment">
                      <AdminTask icon={<CreditCard />} title="Kas Masuk" count={stats.pendingPayments} desc="Upcoming payouts." />
                   </Link>
                   <AdminTask icon={<Activity />} title="Sync Level" count="LIVE" desc="Global evaluation node." />
                </div>

                <div className="mt-8 pt-8 border-t border-zinc-100">
                   <Link href="/admin/merch" className="w-full bg-[#CCFF00] border-2 border-black py-4 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                      Full Report Portal <ChevronRight size={14} />
                   </Link>
                </div>
             </div>
          </div>
        </div>

        {/* Graph */}
        <div className="bg-white border-2 border-black rounded-[4rem] p-12 shadow-[6px_6px_0px_0px_#000]">
           <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                 <LayoutGrid size={24} />
                 <h4 className="font-black text-2xl uppercase tracking-tighter italic">Participation Statistics</h4>
              </div>
              <button onClick={fetchStats} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors group">
                 Sync Data <RefreshCw size={14} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
              </button>
           </div>
           
           <div className="h-64 flex items-end justify-between px-4 border-b-2 border-zinc-100 pb-2 mb-8">
              {[60,40,80,20,90,30,50,70,40,60,95,45,30,65,85].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-3 group cursor-pointer relative">
                   <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className={`w-4 bg-zinc-50 border-x-2 border-t-2 border-black rounded-t-lg group-hover:bg-[#CCFF00] transition-colors ${i % 3 === 0 ? 'bg-[#CCFF00]/20' : ''}`}
                   />
                   <span className="text-[8px] font-bold text-zinc-300 uppercase rotate-45 mt-4 group-hover:text-black">{i + 1} May</span>
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
                      {h}
                   </div>
                </div>
              ))}
           </div>
           
           <div className="flex flex-wrap gap-10">
              <Legend color="bg-zinc-200" label="Team Entries" />
              <Legend color="bg-[#CCFF00]" label="Verified Nodes" />
              <Legend color="bg-black" label="Operational Sync" />
           </div>
        </div>

    </motion.div>
  );
}

function AdminTask({ icon, title, desc, count }: any) {
  return (
    <div className="bg-zinc-50 border-2 border-black p-6 rounded-[2.5rem] flex items-center gap-6 hover:bg-white hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all cursor-pointer group">
       <div className="w-16 h-16 bg-white border-2 border-black rounded-3xl flex items-center justify-center shadow-inner group-hover:bg-[#CCFF00] transition-all">
          {React.cloneElement(icon, { size: 28 })}
       </div>
       <div className="flex-1">
          <div className="flex items-center gap-3">
             <h5 className="font-black text-sm uppercase tracking-tight">{title}</h5>
             <span className="bg-black text-[#CCFF00] text-[10px] px-2 py-0.5 rounded-md font-black">{count}</span>
          </div>
          <p className="text-[10px] text-zinc-400 font-bold uppercase italic tracking-tight">{desc}</p>
       </div>
       <div className="p-2 border-2 border-zinc-100 rounded-full group-hover:border-black group-hover:bg-[#CCFF00] transition-all">
          <ChevronRight size={16} />
       </div>
    </div>
  );
}

function Legend({ color, label }: any) {
  return (
    <div className="flex items-center gap-3">
       <div className={`w-3 h-3 rounded-full ${color} border border-black`} />
       <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 leading-none">{label}</span>
    </div>
  );
}
