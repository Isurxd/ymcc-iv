'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScanFace, CheckCircle2, XCircle } from 'lucide-react';

export default function QRScannerOffline() {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input continuously (for physical scanner)
  useEffect(() => {
    const focusInterval = setInterval(() => {
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    }, 1000);
    return () => clearInterval(focusInterval);
  }, []);

  const handleScan = async (value: string) => {
    if (!value) return;
    try {
      setStatus('IDLE');
      const res = await fetch('/api/admin/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId: value })
      });
      
      const data = await res.json();
      if (res.ok) {
        setStatus('SUCCESS');
        setMessage(data.message);
      } else {
        setStatus('ERROR');
        setMessage(data.message || 'Gagal tersinkronisasi');
      }
    } catch (e) {
      setStatus('ERROR');
      setMessage('Network error. Check connection.');
    } finally {
      setInputValue(''); // Reset for next scan
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-8">
      <header className="border-b-4 border-foreground pb-4">
        <h1 className="text-5xl font-heading text-foreground italic uppercase">ATTENDANCE SYSTEM.</h1>
        <p className="font-bold text-zinc-600 mt-2">Scan QR dari Nametag Peserta. Data akan disinkronisasikan secara otomatis.</p>
      </header>

      <Card className="bg-white border-4 border-foreground shadow-[8px_8px_0_0_#CCFF00] rounded-none">
        <CardHeader className="bg-zinc-50 border-b-4 border-foreground flex flex-col items-center justify-center p-10">
           <ScanFace className="w-32 h-32 text-foreground opacity-20 mb-6" />
           <CardTitle className="text-center text-xl font-bold uppercase tracking-widest text-[#001F3F]">
              Scanner Aktif — Arahkan QR Code
           </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          
          <div className="relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                 if (e.key === 'Enter') {
                   e.preventDefault();
                   handleScan(inputValue);
                 }
              }}
              placeholder="Klik disini dan mulai scan..."
              className="h-20 text-center text-2xl font-mono uppercase bg-zinc-100 border-4 border-foreground rounded-none focus-visible:ring-0 focus-visible:border-accent shadow-inner transition-colors"
              autoFocus
            />
            <div className="absolute right-6 top-6 animate-pulse w-4 h-4 rounded-full bg-red-500"></div>
          </div>

          {status !== 'IDLE' && (
            <div className={`p-6 border-4 border-foreground flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 shadow-brutal-sm ${status === 'SUCCESS' ? 'bg-[#CCFF00]' : 'bg-red-500 text-white'}`}>
              {status === 'SUCCESS' ? <CheckCircle2 className="w-16 h-16" /> : <XCircle className="w-16 h-16" />}
              <h3 className="text-3xl font-heading italic uppercase tracking-wider">{message}</h3>
            </div>
          )}

        </CardContent>
      </Card>
      
      <p className="text-center font-bold text-zinc-400 text-sm italic">
        *Data presensi secara otomatis mengalir ke Google Sheets setiap 5 menit via Batch Sync.
      </p>
    </div>
  );
}
