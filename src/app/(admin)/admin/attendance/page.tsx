'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScanFace, CheckCircle2, XCircle, Camera, MousePointer2 } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from '@/components/ui/button';

export default function QRScannerOffline() {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [message, setMessage] = useState('');
  const [useCamera, setUseCamera] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Physical scanner auto-focus
  useEffect(() => {
    if (useCamera) return;
    const focusInterval = setInterval(() => {
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    }, 1000);
    return () => clearInterval(focusInterval);
  }, [useCamera]);

  // Webcam Scanner Logic
  useEffect(() => {
    if (!useCamera) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        handleScan(decodedText);
        scanner.clear(); // Stop scanning after success
        setUseCamera(false);
      },
      (error) => {
        // console.warn(error);
      }
    );

    return () => {
      scanner.clear().catch(e => console.error("Scanner clean error", e));
    };
  }, [useCamera]);

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
      setInputValue(''); 
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-8 pb-10">
      <header className="border-b-4 border-foreground pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-foreground uppercase">ATTENDANCE SYSTEM.</h1>
          <p className="font-bold text-zinc-600 mt-2 italic shadow-zinc-200">Mode: {useCamera ? 'WEB-CAMERA' : 'PHYSICAL-SCANNER'}</p>
        </div>
        <Button 
          onClick={() => { setUseCamera(!useCamera); setStatus('IDLE'); }}
          className={`border-4 border-foreground rounded-none shadow-brutal-sm font-black uppercase ${useCamera ? 'bg-red-500 text-white' : 'bg-accent text-foreground'}`}
        >
          {useCamera ? <MousePointer2 className="mr-2" /> : <Camera className="mr-2" />}
          {useCamera ? 'GUNAKAN SCANNER FISIK' : 'GUNAKAN KAMERA (WEBCAM)'}
        </Button>
      </header>

      <Card className="bg-white border-4 border-foreground shadow-[8px_8px_0_0_#CCFF00] rounded-none overflow-hidden">
        {useCamera && (
           <div id="reader" className="w-full bg-zinc-900 aspect-video border-b-4 border-foreground"></div>
        )}
        
        {!useCamera && (
          <CardHeader className="bg-zinc-50 border-b-4 border-foreground flex flex-col items-center justify-center p-10">
             <ScanFace className="w-32 h-32 text-foreground opacity-20 mb-6" />
             <CardTitle className="text-center text-xl font-bold uppercase tracking-widest text-[#001F3F]">
                Scanner Aktif — Arahkan QR Code
             </CardTitle>
          </CardHeader>
        )}
        
        <CardContent className="p-8 space-y-8">
          {!useCamera && (
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
          )}

          {status !== 'IDLE' && (
            <div className={`p-6 border-4 border-foreground flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 shadow-brutal-sm ${status === 'SUCCESS' ? 'bg-[#CCFF00]' : 'bg-red-500 text-white'}`}>
              {status === 'SUCCESS' ? <CheckCircle2 className="w-16 h-16" /> : <XCircle className="w-16 h-16" />}
              <h3 className="text-3xl font-black uppercase tracking-wider">{message}</h3>
              {status === 'SUCCESS' && (
                 <p className="font-bold text-xs opacity-80 uppercase">PRESENSI BERHASIL DICATAT KE SERVER</p>
              )}
            </div>
          )}

          {useCamera && status === 'IDLE' && (
             <div className="text-center p-10 bg-zinc-50 border-4 border-dashed border-zinc-200">
                <p className="font-black text-xl text-zinc-400 uppercase italic">MENUNGGU PEMINDAIAN KAMERA...</p>
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
