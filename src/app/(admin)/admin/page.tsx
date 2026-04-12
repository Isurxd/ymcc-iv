'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, CreditCard, Activity } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalTeams: 0,
    pendingPayments: 0,
    pendingDocuments: 0,
    verifiedTeams: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
    
    // Optional: Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { title: 'TOTAL TIM', value: stats.totalTeams, icon: Users, bg: 'bg-white', border: 'border-blue-700' },
    { title: 'ANTREAN BAYAR', value: stats.pendingPayments, icon: CreditCard, bg: 'bg-white', border: 'border-orange-500' },
    { title: 'ANTREAN BERKAS', value: stats.pendingDocuments, icon: FileText, bg: 'bg-white', border: 'border-red-600' },
    { title: 'TERVALIDASI', value: stats.verifiedTeams, icon: Activity, bg: 'bg-accent', border: 'border-foreground' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <header className="mb-10 border-b-4 border-foreground pb-6 bg-white p-6 shadow-brutal-sm">
        <h1 className="text-5xl font-heading italic tracking-wide text-foreground uppercase">
          PUSAT DATA STATISTIK.
        </h1>
        <p className="text-zinc-600 font-bold uppercase mt-2">Ringkasan pendaftar per cabang lomba secara real-time.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} className={`rounded-none border-4 ${stat.border} shadow-brutal-sm ${stat.bg} ${loading ? 'animate-pulse' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 border-b-4 border-dashed border-zinc-200">
              <CardTitle className="text-sm font-bold uppercase text-foreground">
                {stat.title}
              </CardTitle>
              <div className="p-2 border-2 border-foreground bg-white shadow-[2px_2px_0_0_#000]">
                <stat.icon className="w-5 h-5 text-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-5xl font-heading italic text-foreground tracking-wide">
                {loading ? '...' : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <Card className="bg-white rounded-none border-4 border-foreground shadow-[6px_6px_0_0_#E63E00] h-80 flex flex-col items-center justify-center text-foreground p-6">
          <Activity className="w-20 h-20 mb-4 opacity-20" />
          <h3 className="font-heading italic text-2xl uppercase">GRAFIK PENDAFTAR</h3>
          <p className="font-bold border-t-2 border-foreground pt-2 mt-2">MODUL DALAM PERKEMBANGAN</p>
        </Card>
        <Card className="bg-white rounded-none border-4 border-foreground shadow-brutal-lg h-80 flex flex-col items-center justify-center text-foreground p-6">
          <CircleDollarSignIcon className="w-20 h-20 mb-4 opacity-20" />
          <h3 className="font-heading italic text-2xl uppercase">ARUS KAS REGISTRASI</h3>
          <p className="font-bold border-t-2 border-foreground pt-2 mt-2">MODUL DALAM PERKEMBANGAN</p>
        </Card>
      </div>
    </motion.div>
  );
}

function CircleDollarSignIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 18V6" />
    </svg>
  );
}
