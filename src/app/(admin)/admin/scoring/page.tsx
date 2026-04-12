'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Send, AlertTriangle } from 'lucide-react';
import { getSocket } from '@/lib/socket-client';

export default function ScoringCenter() {
  const [teamId, setTeamId] = useState('');
  const [score, setScore] = useState('');
  const [category, setCategory] = useState('PILIHAN GANDA');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const socket = getSocket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numScore = parseInt(score);
    if (isNaN(numScore) || numScore < 0 || numScore > 100) {
      setStatus('ERROR: Nilai harus antara 0 - 100');
      return;
    }

    if (!teamId) {
      setStatus('ERROR: Team ID (Nomor Registrasi) Wajib Diisi');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      // Send score to DB first
      const res = await fetch('/api/admin/scoring', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ registrationId: teamId.toUpperCase(), score: numScore, category })
      });

      const data = await res.json();

      if (!res.ok) {
         setStatus(`ERROR: ${data.message}`);
         setLoading(false);
         return;
      }

      // Emit live leaderboard update event via Websocket
      // (This triggers the Videotron and Participant Dashboards to animate immediately)
      socket.emit('SCORE_UPDATED', {
        teamId: data.teamId,
        category: data.category,
        addedScore: data.score,
        timestamp: new Date().toISOString()
      });

      setStatus(`SUCCESS: Nilai ${data.score} untuk ${data.teamId} berhasil disimpan & disiarkan.`);
      setTeamId('');
      setScore('');
    } catch (e) {
      setStatus('ERROR: Terjadi kesalahan jaringan / sistem saat menyimpan nilai');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="border-b-4 border-foreground pb-6">
        <h1 className="text-5xl font-black uppercase tracking-wide text-[#001F3F]">
          SCORING CENTER.
        </h1>
        <p className="text-lg text-zinc-600 font-bold border-l-4 border-accent pl-4 mt-2 uppercase tracking-wide">
          MODUL AUDIT & PENILAIAN LIVE EVENT
        </p>
      </header>

      <Card className="bg-white border-4 border-foreground shadow-brutal-lg rounded-none mt-8">
        <CardHeader className="bg-[#001F3F] border-b-4 border-foreground text-white p-6">
          <CardTitle className="text-3xl font-black uppercase flex items-center gap-3">
             <Trophy className="w-8 h-8 text-[#CCFF00]" />
             INPUT NILAI MANUAL
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {status && (
            <div className={`p-4 mb-6 border-4 font-bold uppercase transition-all ${status.startsWith('ERROR') ? 'bg-red-100 border-red-500 text-red-700 shadow-[4px_4px_0_#ef4444]' : 'bg-green-100 border-green-500 text-green-700 shadow-[4px_4px_0_#22c55e]'}`}>
              {status.startsWith('ERROR') && <AlertTriangle className="inline w-5 h-5 mr-2" />}
              {status}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-bold uppercase tracking-wider text-xs text-zinc-600">ID / NOMOR REGISTRASI TIM</label>
              <Input 
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                placeholder="Misal: REG-221"
                className="h-16 text-2xl font-mono uppercase bg-zinc-50 border-4 border-foreground rounded-none shadow-[inset_4px_4px_0_0_rgba(0,0,0,0.05)] focus-visible:ring-0 focus-visible:border-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-bold uppercase tracking-wider text-xs text-zinc-600">Kategori Penilaian</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-16 font-bold uppercase disabled:bg-zinc-100 border-4 border-foreground rounded-none px-4 focus:outline-none focus:border-accent appearance-none bg-white font-heading text-lg"
                >
                  <option value="PILIHAN GANDA">Sesi 1 - Pilihan Ganda</option>
                  <option value="PRAKTIK POST 1">Sesi 2 - Praktik Pos 1</option>
                  <option value="PRAKTIK POST 2">Sesi 2 - Praktik Pos 2</option>
                  <option value="STUDI KASUS">Sesi 3 - Studi Kasus</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-bold uppercase tracking-wider text-xs text-zinc-600">NILAI DIBERIKAN (0-100)</label>
                <Input 
                  type="number"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="100"
                  className="h-16 text-3xl font-black bg-zinc-50 border-4 border-foreground rounded-none shadow-[inset_4px_4px_0_0_rgba(0,0,0,0.05)] focus-visible:ring-0 focus-visible:border-accent "
                />
              </div>
            </div>

            <Button disabled={loading} type="submit" className="w-full h-16 bg-accent hover:bg-[#E63E00] hover:text-white text-foreground font-black uppercase tracking-widest text-2xl border-4 border-foreground shadow-brutal hover:-translate-y-1 transition-all rounded-none mt-4">
              <Send className="w-6 h-6 mr-3" /> {loading ? 'MENYIMPAN...' : 'PUSH NILAI KE LEADERBOARD'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="font-bold text-center text-zinc-500 uppercase text-sm mt-8">Catatan: Pastikan nilai yang dimasukkan sudah divalidasi oleh dewan juri lapangan.</p>
    </div>
  );
}
