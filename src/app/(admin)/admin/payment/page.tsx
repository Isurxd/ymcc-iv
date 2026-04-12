'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, RefreshCw } from 'lucide-react';
import Image from 'next/image';

interface Payment {
  id: string;
  amount: number;
  proofUrl: string;
  registration: {
    event: { name: string };
    user: { name: string; email: string };
  };
}

export default function AdminPaymentPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/payments');
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      }
    } catch (error) {
      console.error('Failed to fetch payments', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleVerify = async (id: string, action: 'APPROVE' | 'REJECT') => {
    if (!confirm(`Are you sure you want to ${action} this payment?`)) return;

    try {
      const res = await fetch(`/api/admin/payments/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        fetchPayments(); // Refresh list
      } else {
        alert('Verification failed. See console for details.');
        console.error(await res.json());
      }
    } catch (error) {
      console.error('API Error', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <header className="mb-10 border-b-4 border-foreground pb-6 bg-white p-6 shadow-brutal-sm flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-heading italic tracking-wide text-foreground uppercase">
            PERIKSA BUKTI DANA.
          </h1>
          <p className="text-zinc-600 font-bold uppercase mt-2">Daftar Antrean Pembayaran Belum Diverifikasi</p>
        </div>
        <Button onClick={fetchPayments} disabled={loading} variant="outline" className="h-12 border-4 border-foreground rounded-none shadow-brutal font-bold">
          <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} /> REFRESH
        </Button>
      </header>

      {loading && payments.length === 0 ? (
         <div className="p-8 text-center font-bold text-lg uppercase bg-white border-4 border-foreground shadow-brutal">Memuat Antrean...</div>
      ) : payments.length === 0 ? (
        <div className="p-8 text-center font-bold text-lg uppercase bg-accent border-4 border-foreground shadow-[6px_6px_0_0_#E63E00]">
          TIDAK ADA ANTREAN PEMBAYARAN SAAT INI 🔥
        </div>
      ) : (
        <div className="space-y-6">
          {payments.map((item) => (
            <Card key={item.id} className="bg-white border-4 border-foreground shadow-[6px_6px_0_0_#CCFF00] rounded-none hover:-translate-y-1 transition-transform">
              <CardHeader className="pb-4 flex flex-col md:flex-row md:items-center justify-between border-b-4 border-foreground bg-zinc-50">
                <div>
                  <CardTitle className="text-3xl font-heading italic uppercase text-foreground">
                    {item.registration.user.name}
                  </CardTitle>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="px-2 py-1 bg-primary text-white text-xs font-bold border-2 border-foreground">{item.registration.event.name}</span>
                    <span className="px-2 py-1 bg-white text-foreground text-xs font-bold border-2 border-foreground relative top-0.5">Email: {item.registration.user.email}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-end">
                   <span className="px-4 py-2 bg-accent border-2 border-foreground font-bold text-sm uppercase shadow-brutal-sm">
                     Rp {item.amount.toLocaleString('id-ID')}
                   </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-center justify-between pt-6">
                <a href={item.proofUrl} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                  <Button className="rounded-none border-4 border-foreground shadow-brutal text-foreground bg-white hover:bg-zinc-100 font-bold uppercase tracking-widest h-12 w-full md:w-auto mb-4 md:mb-0">
                    BUKA LAMPIRAN CEK BUKTI BAYAR
                  </Button>
                </a>
                <div className="space-x-4 flex w-full md:w-auto">
                  <Button onClick={() => handleVerify(item.id, 'REJECT')} className="flex-1 rounded-none bg-white text-red-600 border-4 border-foreground hover:bg-red-600 hover:text-white shadow-brutal h-12 font-bold">
                    <X className="w-5 h-5 mr-1" /> TOLAK
                  </Button>
                  <Button onClick={() => handleVerify(item.id, 'APPROVE')} className="flex-1 rounded-none bg-primary text-white border-4 border-foreground hover:bg-foreground hover:text-white shadow-brutal h-12 font-bold">
                    <Check className="w-5 h-5 mr-1" /> VALIDASI SAH
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
