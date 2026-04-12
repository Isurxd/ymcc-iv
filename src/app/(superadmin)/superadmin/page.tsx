'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Shield, Terminal, Database } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({ totalOptions: 0, adminCount: 0, operatorCount: 0, userCount: 0 });

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
           setStats({
             totalOptions: data.length,
             adminCount: data.filter((u: any) => u.role === 'ADMIN').length,
             operatorCount: data.filter((u: any) => u.role === 'OPERATOR').length,
             userCount: data.filter((u: any) => u.role === 'USER').length,
           });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-10 border-b-8 border-black pb-6 bg-white p-8 shadow-[8px_8px_0_0_red]">
        <h1 className="text-6xl font-heading italic font-black tracking-wide text-black uppercase drop-shadow-[4px_4px_0_red] [-webkit-text-stroke:1px_black]">
          NETWORK STATS.
        </h1>
        <p className="text-zinc-600 font-bold uppercase mt-4 text-xs tracking-widest border-l-4 border-red-600 pl-4">Menampilkan ringkasan akses entitas pengguna dalam jaringan tertutup.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-none border-4 border-black bg-white shadow-[6px_6px_0_0_black]">
           <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-4 border-dashed border-black">
             <CardTitle className="text-sm font-black uppercase text-black tracking-widest">TOTAL AKUN</CardTitle>
             <Database className="w-5 h-5" />
           </CardHeader>
           <CardContent className="pt-6">
             <div className="text-5xl font-heading italic font-black text-black">{stats.totalOptions}</div>
           </CardContent>
        </Card>

        <Card className="rounded-none border-4 border-black bg-red-600 text-white shadow-[6px_6px_0_0_black]">
           <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-4 border-dashed border-black">
             <CardTitle className="text-sm font-black uppercase text-white tracking-widest">AKSES ADMIN</CardTitle>
             <Shield className="w-5 h-5" />
           </CardHeader>
           <CardContent className="pt-6">
             <div className="text-5xl font-heading italic font-black text-white">{stats.adminCount}</div>
           </CardContent>
        </Card>

        <Card className="rounded-none border-4 border-black bg-black text-white shadow-[6px_6px_0_0_red]">
           <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-4 border-dashed border-zinc-800">
             <CardTitle className="text-sm font-black uppercase text-white tracking-widest">OPERATOR</CardTitle>
             <Terminal className="w-5 h-5 text-red-500" />
           </CardHeader>
           <CardContent className="pt-6">
             <div className="text-5xl font-heading italic font-black text-white drop-shadow-[2px_2px_0_red]">{stats.operatorCount}</div>
           </CardContent>
        </Card>

        <Card className="rounded-none border-4 border-black bg-zinc-200 shadow-[6px_6px_0_0_black]">
           <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-4 border-dashed border-zinc-400">
             <CardTitle className="text-sm font-black uppercase text-zinc-600 tracking-widest">PESERTA / USER</CardTitle>
             <Users className="w-5 h-5 text-zinc-500" />
           </CardHeader>
           <CardContent className="pt-6">
             <div className="text-5xl font-heading italic font-black text-zinc-800">{stats.userCount}</div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
