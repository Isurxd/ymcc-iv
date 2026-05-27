'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { 
  Zap, Trophy, Store, ArrowRight, Play, Globe, Star, HardHat, ChevronDown, 
  Briefcase, UserCheck, MessageSquare, MonitorCheck, LayoutGrid, Cpu, Users2,
  Award, HeartHandshake, Calendar, Settings, Tv, Plus, Info, ChevronRight,
  ShieldCheck, FileText, Activity
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AppSwal from '@/lib/swal';

export default function LandingPage() {
  const { t, lang } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#F4F4F5]" />;

  const openSupportChat = () => {
    AppSwal.fire({
      title: 'SUPPORT NODE',
      text: 'Starting a high-priority communication link with YMCC Command...',
      icon: 'info',
      confirmButtonText: 'INITIALIZE CHAT',
      confirmButtonColor: '#000000'
    });
  }

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-black font-poppins pb-32">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-[1.2]">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 bg-[#CCFF00] border-2 border-black px-4 py-2 rounded-full mb-8 font-black text-[10px] uppercase tracking-[0.3em] shadow-[2px_2px_0px_0px_#000]"
            >
               <span className="w-2 h-2 bg-black rounded-full animate-ping" />
               {t('hero.badge')}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              className="font-black text-6xl md:text-8xl lg:text-[7rem] tracking-[-0.05em] leading-[0.85] uppercase mb-10 text-black"
            >
              THE <br/>
              <span className="relative inline-block text-white text-stroke-navy">
                GREEN
              </span> <br/>
              <span className="text-[#CCFF00] bg-black px-6 py-2 inline-block mt-4 italic">
                {t('hero.compass')}
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-lg font-bold text-zinc-400 max-w-xl mb-12 leading-relaxed uppercase italic"
            >
              {t('hero.desc')}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row gap-6">
               <Link href="/register" className="bg-[#CCFF00] text-black px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-4 group">
                  {t('hero.cta_start')} <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
               </Link>
               <button 
                onClick={() => AppSwal.fire({ title: 'COORDINATION BROADCAST', html: '<div class="p-4 bg-zinc-50 rounded-2xl border-2 border-black font-bold uppercase text-xs">Official 2026 Orientation Module Loading...</div>', confirmButtonColor: '#000' })}
                className="flex items-center gap-5 font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-all group"
               >
                  <div className="w-12 h-12 border-2 border-black rounded-full flex items-center justify-center group-hover:bg-[#CCFF00] transition-all shadow-[2px_2px_0px_0px_#000] group-hover:shadow-none">
                    <Play className="w-3 h-3 fill-current translate-x-0.5 text-black" />
                  </div>
                  {t('hero.cta_watch')}
               </button>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 w-full relative max-w-2xl">
             <div className="aspect-video bg-white rounded-[3rem] border-2 border-black overflow-hidden shadow-[8px_8px_0px_0px_#000] relative">
                <iframe 
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/OQ-mfJ2hs58?autoplay=1&mute=1&loop=1&playlist=OQ-mfJ2hs58&controls=0&modestbranding=1&showinfo=0&rel=0" 
                  title="YMCC Cinematic" allow="autoplay; encrypted-media" allowFullScreen
                ></iframe>
             </div>
             <div className="absolute -bottom-6 -right-6 bg-[#CCFF00] p-5 rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_#000] z-20 flex items-center gap-4">
                <img src="/assets/ymcc logo kotak.png" alt="Logo" className="w-10 h-10 object-contain" />
                <div>
                   <div className="font-black text-[8px] uppercase tracking-[0.2em] text-black/40">OFFICIAL NODE</div>
                   <div className="font-black text-sm text-black tracking-tighter uppercase whitespace-nowrap">EXTRACTING EXCELLENCE</div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 2. STRATEGIC COUNCIL */}
      <section className="py-24 container mx-auto px-6 max-w-7xl">
         <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">STRATEGIC <br/> COUNCIL.</h2>
            <div className="bg-white border-2 border-black px-8 py-4 rounded-[2rem] shadow-[4px_4px_0px_0px_#000] flex items-center gap-6">
                <div className="flex -space-x-4">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-12 h-12 rounded-full bg-zinc-100 border-2 border-black overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Avatar" className="w-full h-full object-cover" />
                     </div>
                   ))}
                </div>
                <div className="font-black text-xs uppercase tracking-tight">Institutional <br/> Support Active</div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <StrategicCard 
              icon={<ShieldCheck />} 
              title="Academic Integrity" 
              desc="Verified selection process under UPN 'Veteran' Yogyakarta supervision."
            />
            <StrategicCard 
              icon={<Activity />} 
              title="Real-time Eval" 
              desc="Dynamic scoring and team verification via digital centralized node."
            />
            <StrategicCard 
              icon={<Zap />} 
              title="Fast Pipeline" 
              desc="Accelerated registration and technical documentation submission."
            />
         </div>
      </section>

      {/* 3. DEPARTMENT DIRECTORY */}
      <section className="py-24 container mx-auto px-6 max-w-7xl">
          <div className="inline-flex items-center gap-3 bg-black text-[#CCFF00] px-4 py-1 rounded-lg mb-12 font-black text-[9px] uppercase tracking-[0.4em] italic shadow-[3px_3px_0px_0px_#000]">
             Operational Directory
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <CommandCard icon={<Award />} title="COMPETITION" items={['Main Engineering','Theory Level']} color="bg-[#CCFF00]" path="/events" />
             <CommandCard icon={<HeartHandshake />} title="FUNDRAISING" items={['Link Assets','Public Synergy']} color="bg-red-400" path="/events" />
             <CommandCard icon={<Calendar />} title="EVENT" items={['Session Sync','Logistics Control']} color="bg-[#CCFF00]" path="/events" />
             <CommandCard icon={<Settings />} title="OPERATIONAL" items={['Node Sync','Base Audit']} color="bg-red-400" path="/events" />
             <CommandCard icon={<Tv />} title="MEDIA" items={['Visual Projection','Node Communication']} color="bg-[#CCFF00]" path="/events" />
             
             <Link href="/register" className="bg-[#CCFF00] border-2 border-black p-10 rounded-[3rem] flex flex-col justify-between hover:bg-black group transition-all shadow-[6px_6px_0px_0px_#000] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 translate-x-4 -translate-y-4">
                   <Zap size={140} />
                </div>
                <h4 className="font-black text-3xl text-black group-hover:text-white uppercase italic tracking-tighter leading-none transition-colors relative z-10">READY TO JOIN <br/> THE NODE?</h4>
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center transition-all group-hover:bg-[#CCFF00] group-hover:translate-x-2 relative z-10">
                   <ArrowRight className="text-[#CCFF00] group-hover:text-black w-8 h-8" />
                </div>
             </Link>
          </div>
      </section>

      {/* 4. REWARDS ROADMAP */}
      <section className="py-24 container mx-auto px-6 max-w-7xl">
         <div className="bg-white border-2 border-black rounded-[4rem] p-12 md:p-20 shadow-[8px_8px_0px_0px_#000]">
            <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
               <div>
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic mb-4 text-[#CCFF00] stroke-black" style={{ WebkitTextStroke: '1.5px black' }}>Milestone Roadmap</h2>
                  <p className="text-zinc-400 font-bold uppercase italic tracking-widest text-sm">Achieve tiers to unlock exclusive nodes.</p>
               </div>
               <div className="bg-[#EBF7D3] border-2 border-black p-8 rounded-[2.5rem] flex items-center gap-8 shadow-[4px_4px_0px_0px_#000]">
                  <div className="font-black text-2xl italic tracking-tighter">PHASE 2.0</div>
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active <br/> Registration</div>
               </div>
            </div>

            <div className="relative pt-20 pb-12 overflow-x-auto no-scrollbar">
               <div className="min-w-[800px] relative">
                  <div className="absolute top-14 left-0 w-full h-[3px] bg-zinc-100" />
                  <div className="absolute top-14 left-0 w-[40%] h-[3px] bg-[#CCFF00] z-10 shadow-[0_0_10px_#CCFF00]" />

                  <div className="flex justify-between relative z-20">
                     <RoadmapTier label="Tier I: Iron" color="bg-zinc-500" progress="0" active />
                     <RoadmapTier label="Tier II: Bronze" color="bg-amber-700" progress="20" active />
                     <RoadmapTier label="Tier III: Silver" color="bg-zinc-300" progress="130" pending />
                     <RoadmapTier label="Tier IV: Gold" color="bg-[#CCFF00]" progress="565" pending />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. SUPPORT FAQ */}
      <section id="support" className="py-24 container mx-auto px-6 max-w-4xl">
         <div className="bg-white border-2 border-black rounded-[4rem] p-12 shadow-[8px_8px_0px_0px_#000]">
            <div className="flex items-center gap-6 mb-12 border-b border-zinc-100 pb-12">
               <div className="w-20 h-20 bg-[#CCFF00] border-2 border-black rounded-3xl flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                  <MessageSquare size={32} />
               </div>
               <div>
                  <h3 className="text-4xl font-black uppercase tracking-tighter italic">Support Node</h3>
                  <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest mt-1">Real-time resolution for applicants.</p>
               </div>
            </div>
            
            <div className="space-y-4">
               {['What is YMCC VII?','How does the selection pipeline work?','What are Node Rewards?','When is the final broadcast?'].map((q, i) => (
                 <div 
                  key={i} 
                  onClick={openSupportChat}
                  className="flex items-center justify-between p-7 bg-zinc-50 border-2 border-black rounded-[2rem] hover:bg-white hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all cursor-pointer group"
                 >
                    <span className="font-bold text-sm uppercase tracking-tight">{q}</span>
                    <Plus size={20} className="text-zinc-300 group-hover:text-black group-hover:rotate-90 transition-all" />
                 </div>
               ))}
            </div>
         </div>
      </section>

    </div>
  );
}

// ---------------- UI COMPONENTS ---------------- //

function StrategicCard({ icon, title, desc }: any) {
  return (
    <div 
      onClick={() => AppSwal.fire({ title: title.toUpperCase(), text: 'Strategic coordination bridge protocol active.', icon: 'success', confirmButtonColor: '#000' })}
      className="bg-white border-2 border-black p-10 rounded-[3rem] shadow-[6px_6px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group overflow-hidden relative cursor-pointer"
    >
       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          {React.cloneElement(icon, { size: 120 })}
       </div>
       <div className="w-16 h-16 bg-[#CCFF00] border-2 border-black rounded-3xl flex items-center justify-center mb-8 shadow-[3px_3px_0px_0px_#000] group-hover:bg-black group-hover:text-[#CCFF00] transition-all">
          {React.cloneElement(icon, { size: 28, strokeWidth: 3 })}
       </div>
       <h4 className="font-black text-2xl uppercase tracking-tighter mb-4 italic">{title}</h4>
       <p className="text-zinc-400 font-bold uppercase text-[11px] italic leading-relaxed tracking-tight">{desc}</p>
    </div>
  );
}

function RoadmapTier({ label, color, progress, active = false, pending = false }: any) {
  return (
    <div className="flex flex-col items-center gap-6 relative group cursor-help">
       <div className={`w-28 h-28 rounded-full border-2 border-black flex items-center justify-center relative overflow-hidden transition-all duration-500 ${active ? 'bg-white shadow-[6px_6px_0px_0px_#CCFF00] scale-110' : 'bg-zinc-50 border-dashed opacity-40 hover:opacity-100 hover:border-solid hover:scale-105'}`}>
          <div className="absolute inset-x-0 bottom-0 h-10 bg-zinc-100 opacity-20" />
          <div className={`w-12 h-12 rounded-lg ${color} border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center group-hover:rotate-[15deg] transition-transform`}>
             <Trophy size={20} className="text-black" />
          </div>
       </div>
       <div className="text-center">
          <h5 className={`font-black text-xs uppercase tracking-tight mb-2 ${active ? 'text-black' : 'text-zinc-300'}`}>{label}</h5>
          <span className="font-black text-lg italic tracking-tighter opacity-10">{progress}</span>
          <div className="flex items-center justify-center gap-1 mt-2">
             <ChevronRight size={10} className="text-zinc-200" />
             <ChevronRight size={10} className="text-zinc-200" />
          </div>
       </div>
    </div>
  );
}

function CommandCard({ icon, title, items, color, path }: any) {
  return (
    <Link href={path || '#'} className="bg-white border-2 border-black p-10 rounded-[3rem] group hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[6px_6px_0px_0px_#000] transition-all flex flex-col justify-between h-full">
       <div className={`w-16 h-16 rounded-[1.5rem] border-2 border-black flex items-center justify-center mb-10 ${color} shadow-[3px_3px_0px_0px_#000] group-hover:scale-110 transition-transform`}>
          {React.cloneElement(icon, { size: 28, strokeWidth: 3 })}
       </div>
       <div>
          <h4 className="font-black text-2xl text-black uppercase italic tracking-tighter mb-4">{title}</h4>
          <div className="space-y-2">
             {items.map((item: string) => (
                <div key={item} className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
                   <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{item}</span>
                </div>
             ))}
          </div>
       </div>
    </Link>
  );
}
