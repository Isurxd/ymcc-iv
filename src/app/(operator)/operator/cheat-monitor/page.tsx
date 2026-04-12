'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, Ban, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSocket } from '@/lib/socket-client';
import { useState, useEffect } from 'react';

export default function CheatMonitorPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [activeParticipants, setActiveParticipants] = useState<number>(0);

  const socket = getSocket();

  useEffect(() => {
    socket.on('CHEAT_WARNING', (data) => {
      setLogs((prev) => {
        const existingIdx = prev.findIndex(log => log.id === data.id);
        const newLogEntry = { ...data, lastSeen: new Date().toLocaleTimeString() };
        
        if (existingIdx !== -1) {
          // Update existing
          const newArray = [...prev];
          newArray[existingIdx] = newLogEntry;
          return newArray.sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime() || -1);
        } else {
          // Add new at the top
          return [newLogEntry, ...prev];
        }
      });
    });
    
    fetch('/api/participant-count')
      .then(res => res.json())
      .then(data => setActiveParticipants(data.count))
      .catch(() => {});

    const interval = setInterval(() => {
      fetch('/api/participant-count')
        .then(res => res.json())
        .then(data => setActiveParticipants(data.count))
        .catch(() => {});
    }, 10000);

    return () => {
      socket.off('CHEAT_WARNING');
      clearInterval(interval);
    };
  }, [socket]);

  // Derived Statistics
  const totalViolations = logs.reduce((acc, log) => acc + log.vios, 0);
  const autolockBanned = logs.filter(log => log.vios >= 3).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <header className="mb-10 border-b-8 border-[#001F3F] pb-6 bg-white p-8 shadow-[8px_8px_0_0_#E63E00]">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-6xl font-black uppercase tracking-wide text-[#001F3F]">
              LIVE CHEAT MONITOR.
            </h1>
            <p className="text-zinc-600 font-bold uppercase mt-4 text-xs tracking-[0.2em] border-l-4 border-[#001F3F] pl-4">Menangkap event Blur / Visibility API secara waktu-nyata selama durasi CBT.</p>
          </div>
          <Button className="rounded-none bg-[#001F3F] hover:bg-[#CCFF00] hover:text-[#001F3F] text-white border-4 border-transparent hover:border-[#001F3F] shadow-[4px_4px_0_0_#CCFF00] h-12 uppercase font-bold tracking-widest text-xs">
            <RefreshCw className="mr-2 w-4 h-4" /> RE-SYNC LOG
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="rounded-none border-4 border-[#001F3F] shadow-[6px_6px_0_0_#001F3F] bg-[#CCFF00]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-4 border-dashed border-[#001F3F]">
            <CardTitle className="text-sm font-black uppercase text-[#001F3F] tracking-widest">
              PESERTA AKTIF
            </CardTitle>
            <Activity className="w-6 h-6 text-[#001F3F]" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-6xl font-black text-[#001F3F] font-black">{activeParticipants.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-none border-4 border-[#E63E00] shadow-[6px_6px_0_0_#E63E00] bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-4 border-dashed border-[#E63E00]">
            <CardTitle className="text-sm font-black uppercase text-[#E63E00] tracking-widest">
              TOTAL PELANGGARAN
            </CardTitle>
            <AlertCircle className="w-6 h-6 text-[#E63E00]" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-6xl font-black text-[#E63E00] font-black">{totalViolations}</div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-4 border-[#001F3F] shadow-[6px_6px_0_0_#001F3F] bg-[#001F3F]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-4 border-dashed border-zinc-600">
            <CardTitle className="text-sm font-black uppercase text-white tracking-widest">
              AUTOLOCK / BANNED
            </CardTitle>
            <Ban className="w-6 h-6 text-red-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-6xl font-black uppercase tracking-wide text-[#001F3F]">{autolockBanned}</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white border-4 border-[#001F3F] shadow-[8px_8px_0_0_#001F3F] pt-0">
        <div className="w-full overflow-auto">
          <table className="w-full text-left font-bold uppercase text-sm">
            <thead>
              <tr className="bg-[#001F3F] text-white border-b-4 border-[#001F3F]">
                <th className="p-6 tracking-widest">TIM</th>
                <th className="p-6 tracking-widest text-center">PELANGGARAN (TAB SWITCH)</th>
                <th className="p-6 tracking-widest text-center">SYSTEM REACTION</th>
                <th className="p-6 tracking-widest text-right">WAKTU KEJADIAN</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-dashed divide-zinc-200">
              {logs.map((log, i) => (
                <tr key={i} className="hover:bg-zinc-100 transition-colors">
                  <td className="p-6">
                    <div className="text-[#001F3F] font-black text-2xl">{log.name}</div>
                    <div className="text-zinc-500 text-xs mt-1">{log.id}</div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-flex space-x-2">
                       {Array.from({ length: 3 }).map((_, idx) => (
                         <div key={idx} className={`w-8 h-8 flex items-center justify-center border-2 border-[#001F3F] font-heading ${idx < log.vios ? 'bg-[#E63E00] text-white shadow-[2px_2px_0_0_#001F3F]' : 'bg-transparent text-transparent'}`}>X</div>
                       ))}
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    {log.vios >= 3 
                      ? <span className="bg-[#001F3F] text-red-400 px-4 py-2 border-2 border-red-500 font-black shadow-[2px_2px_0_0_#000]">AUTO-BLOCKED</span>
                      : <span className="bg-[#CCFF00] text-[#001F3F] px-4 py-2 border-2 border-[#001F3F] font-black">WARNING_ISSUED</span>
                    }
                  </td>
                  <td className="p-6 text-right font-semibold text-zinc-600">
                    {log.lastSeen}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
