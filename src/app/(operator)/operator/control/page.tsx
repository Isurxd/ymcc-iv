'use client';

import { useState, useEffect } from 'react';
import { getSocket } from '@/lib/socket-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, ChevronRight, Activity, Terminal } from 'lucide-react';

export default function MasterControlPage() {
  const [examState, setExamState] = useState<'IDLE' | 'RUNNING' | 'PAUSED'>('IDLE');
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  
  const [questions, setQuestions] = useState<{id: string, text: string}[]>([]);

  const socket = getSocket();

  useEffect(() => {
    socket.on('EXAM_STARTED', () => setExamState('RUNNING'));
    socket.on('EXAM_PAUSED', () => setExamState('PAUSED'));
    
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(() => {});

    return () => {
      socket.off('EXAM_STARTED');
      socket.off('EXAM_PAUSED');
    };
  }, [socket]);

  const handleStartExam = () => {
    socket.emit('START_EXAM', { timestamp: Date.now() });
    setExamState('RUNNING');
  };

  const handlePauseExam = () => {
    socket.emit('PAUSE_EXAM');
    setExamState('PAUSED');
  };

  const handleShowQuestion = (question: any) => {
    socket.emit('SHOW_QUESTION', question);
    setActiveQuestionId(question.id);
  };

  return (
    <div className="space-y-8">
      <header className="border-b-4 border-foreground pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-wide text-[#001F3F]">
            MASTER CONTROL PNL.
          </h1>
          <p className="text-lg text-zinc-600 font-bold border-l-4 border-accent pl-4 mt-2 uppercase tracking-wide">
            LIVE EVENT & EXAM BROADCAST SYSTEM
          </p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-100 border-4 border-foreground px-6 py-3 font-bold uppercase drop-shadow-[4px_4px_0_#001F3F] [-webkit-text-stroke:1px_#001F3F]">
          <Terminal className="w-5 h-5" />
          WS STATUS: <span className="text-green-600">CONNECTED</span>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="bg-white border-4 border-foreground shadow-brutal-lg rounded-none h-full">
           <CardHeader className="bg-primary border-b-4 border-foreground p-6">
            <CardTitle className="text-3xl font-black uppercase text-white">GLOBAL TIMER ENGINE</CardTitle>
          </CardHeader>
          <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-8">
             <div className="bg-zinc-100 border-4 border-foreground w-full py-12 shadow-[inset_8px_8px_0_0_rgba(0,0,0,0.05)]">
               <span className="text-8xl font-black uppercase tracking-wide text-[#001F3F]">
                 {examState === 'RUNNING' ? '120:00' : '00:00'}
               </span>
               <p className="mt-4 font-bold uppercase text-zinc-500 tracking-widest text-lg">
                 STATUS: <span className={examState === 'RUNNING' ? 'text-green-600' : 'text-red-500'}>{examState}</span>
               </p>
             </div>

             <div className="flex gap-6 w-full">
               <Button 
                onClick={handleStartExam}
                disabled={examState === 'RUNNING'}
                className="flex-1 h-20 text-2xl font-black uppercase tracking-widest bg-accent hover:bg-orange-500 text-foreground border-4 border-foreground shadow-[8px_8px_0_0_var(--color-foreground)] hover:-translate-y-1 transition-all rounded-none gap-3 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
               >
                 <Play className="w-8 h-8" /> START EXAM
               </Button>
               <Button 
                onClick={handlePauseExam}
                disabled={examState !== 'RUNNING'}
                className="flex-1 h-20 text-2xl font-black uppercase tracking-widest bg-zinc-200 hover:bg-zinc-300 text-foreground border-4 border-foreground shadow-[8px_8px_0_0_var(--color-foreground)] hover:-translate-y-1 transition-all rounded-none gap-3 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
               >
                 <Pause className="w-8 h-8" /> PAUSE (LOCK)
               </Button>
             </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-4 border-foreground shadow-brutal-lg rounded-none">
           <CardHeader className="bg-[#001F3F] border-b-4 border-foreground p-6">
            <CardTitle className="text-3xl font-black uppercase text-white flex items-center justify-between">
              <span>QUESTION DISPATCH</span>
              <Activity className="w-6 h-6 text-amber-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
              <div className="divide-y-4 divide-foreground">
                {questions.length === 0 ? (
                  <div className="p-12 text-center text-zinc-400 font-bold uppercase tracking-widest">TIDAK ADA SOAL DI DATABASE</div>
                ) : questions.map((q) => (
                 <div key={q.id} className={`p-6 flex justify-between items-center transition-colors ${activeQuestionId === q.id ? 'bg-amber-100' : 'hover:bg-zinc-50'}`}>
                   <div>
                     <span className="bg-foreground text-white font-bold px-3 py-1 text-sm border-2 border-transparent mr-3 uppercase">
                       {q.id}
                     </span>
                     <span className="font-bold text-lg">{q.text}</span>
                   </div>
                   <Button 
                     onClick={() => handleShowQuestion(q)}
                     className={`rounded-none border-4 h-12 uppercase font-bold tracking-widest text-xs transition-transform ${
                       activeQuestionId === q.id 
                       ? 'bg-black text-white border-black cursor-not-allowed' 
                       : 'bg-white hover:bg-accent text-foreground border-foreground shadow-brutal-sm hover:translate-x-1 hover:-translate-y-1'
                     }`}
                     disabled={activeQuestionId === q.id}
                   >
                     {activeQuestionId === q.id ? 'BROADCASTING' : 'PUSH TO SCREENS'} <ChevronRight className="w-4 h-4 ml-2" />
                   </Button>
                 </div>
                ))}
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
