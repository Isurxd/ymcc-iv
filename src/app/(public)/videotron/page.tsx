'use client';

import { useState, useEffect } from 'react';
import { getSocket } from '@/lib/socket-client';
import { Trophy, Clock, Users } from 'lucide-react';

export default function VideotronDisplay() {
  const [examState, setExamState] = useState<'IDLE' | 'RUNNING' | 'PAUSED'>('IDLE');
  const [activeQuestion, setActiveQuestion] = useState<{ id: string, text: string } | null>(null);
  const [activeParticipants, setActiveParticipants] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  
  const socket = getSocket();

  useEffect(() => {
    socket.on('EXAM_STARTED', () => setExamState('RUNNING'));
    socket.on('EXAM_PAUSED', () => setExamState('PAUSED'));
    socket.on('ACTIVE_QUESTION', (q) => setActiveQuestion(q));
    
    // Fetch initial data
    fetch('/api/participant-count')
      .then(res => res.json())
      .then(data => setActiveParticipants(data.count))
      .catch(() => {});
      
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => setLeaderboard(data))
      .catch(() => {});

    const interval = setInterval(() => {
      fetch('/api/participant-count')
        .then(res => res.json())
        .then(data => setActiveParticipants(data.count))
        .catch(() => {});
        
      fetch('/api/leaderboard')
        .then(res => res.json())
        .then(data => setLeaderboard(data))
        .catch(() => {});
    }, 10000);

    return () => {
      socket.off('EXAM_STARTED');
      socket.off('EXAM_PAUSED');
      socket.off('ACTIVE_QUESTION');
      clearInterval(interval);
    };
  }, [socket]);

  // If IDLE, show a grand welcoming screen
  if (examState === 'IDLE') {
    return (
      <div className="min-h-screen bg-[#001F3F] text-white flex flex-col items-center justify-center p-12 text-center absolute inset-0 z-[100]">
        <h1 className="text-[120px] font-black uppercase tracking-wide text-[#001F3F]">
          YMCC VII
        </h1>
        <h2 className="text-5xl font-bold uppercase tracking-[0.5em] text-[#CCFF00] border-4 border-[#CCFF00] px-12 py-6 shadow-[8px_8px_0_0_#CCFF00]">
          GRAND FINAL STAGE
        </h2>
        <p className="mt-12 text-2xl text-zinc-400 uppercase tracking-widest animate-pulse">
          Sistem Menunggu Instruksi Master Operator...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col absolute inset-0 z-[100] overflow-hidden">
      {/* Top Bar */}
      <div className="bg-[#001F3F] text-white p-6 px-12 flex justify-between items-center border-b-8 border-[#E63E00] shadow-[0_8px_0_0_#001F3F]">
        <div className="flex items-center gap-6">
          <div className="bg-[#CCFF00] text-[#001F3F] p-3 font-black text-3xl tracking-widest px-6 border-4 border-[#CCFF00]">
            YMCC VII
          </div>
          <span className="text-3xl font-bold uppercase tracking-widest">LIVE BROADCAST</span>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
             <Users className="w-8 h-8 text-[#CCFF00]" />
             <span className="text-4xl font-black ">{activeParticipants.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex items-center gap-3">
             <Clock className={`w-8 h-8 ${examState === 'RUNNING' ? 'text-[#CCFF00] animate-spin-slow' : 'text-red-500'}`} />
             <span className="text-4xl font-black ">{examState === 'RUNNING' ? '120:00' : 'PAUSED'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex p-12 gap-12">
        {/* Left Side: Active Question */}
        <div className="w-2/3 bg-white border-8 border-[#001F3F] shadow-[16px_16px_0_0_#001F3F] flex flex-col">
          <div className="bg-[#E63E00] text-white p-6 border-b-8 border-[#001F3F] flex justify-between items-center">
            <h2 className="text-4xl font-black uppercase">SOAL AKTIF / LIVE QUESTION</h2>
            {activeQuestion && (
              <span className="text-3xl font-black bg-[#001F3F] text-white px-6 py-2 border-4 border-white">
                {activeQuestion.id}
              </span>
            )}
          </div>
          
          <div className="flex-grow flex items-center justify-center p-16 text-center">
            {activeQuestion ? (
              <h3 className="text-6xl font-bold leading-tight uppercase text-[#001F3F]">
                {activeQuestion.text}
              </h3>
            ) : (
              <span className="text-4xl font-bold uppercase text-zinc-300">
                MENUNGGU SOAL BERIKUTNYA DARI OPERATOR...
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Live Leaderboard Module */}
        <div className="w-1/3 bg-[#CCFF00] border-8 border-[#001F3F] shadow-[16px_16px_0_0_#001F3F] flex flex-col">
          <div className="bg-[#001F3F] text-white p-6 border-b-8 border-[#001F3F] flex items-center gap-4">
            <Trophy className="w-10 h-10 text-[#CCFF00]" />
            <h2 className="text-3xl font-black uppercase">LIVE LEADERBOARD</h2>
          </div>
          
          <div className="flex-grow p-8 flex flex-col gap-6">
            {leaderboard.length === 0 ? (
               <div className="text-center font-bold text-[#001F3F] mt-12 animate-pulse uppercase tracking-widest text-lg border-4 border-[#001F3F] p-4">
                 SINKRONISASI DATA KLASEMEN...
               </div>
            ) : leaderboard.map((team) => (
              <div key={team.rank} className="bg-white border-4 border-[#001F3F] p-4 flex items-center justify-between shadow-[4px_4px_0_0_#001F3F]">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 flex items-center justify-center font-heading text-2xl border-4 border-[#001F3F] ${team.rank === 1 ? 'bg-[#E63E00] text-white' : 'bg-zinc-100 text-[#001F3F]'}`}>
                    {team.rank}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg uppercase text-[#001F3F] truncate w-32">{team.name}</span>
                  </div>
                </div>
                <span className="font-black text-3xl text-[#001F3F]">{team.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
