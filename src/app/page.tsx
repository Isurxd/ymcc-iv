'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { 
  Zap, Trophy, Store, ArrowRight, Play, Globe, Star, HardHat, ChevronDown, 
  Briefcase, UserCheck, Search, MessageSquare, MonitorCheck, LayoutGrid, Cpu, Users2, DollarSign,
  Award, HeartHandshake, Calendar, Settings, Tv, Plus, Info, RefreshCw, Wifi, WifiOff, ExternalLink, Package,
  ChevronRight
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function LandingPage() {
  const { t, lang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#F4F4F5]" />;

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-black font-poppins pb-32">
      
      {/* 1. BALANCED HERO SECTION (Keeping YMCC Soul with Grass Aesthetic) */}
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
               <button className="flex items-center gap-5 font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-all group">
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

      {/* 2. BENTO DASHBOARD WIDGETS (The Grass.io 10000% Replication Parts) */}
      <section className="py-24 container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Dashboard Panel */}
          <div className="lg:col-span-8 flex flex-col gap-8">
             <div className="bg-[#EBF7D3] border-2 border-black rounded-[3rem] p-8 md:p-12 shadow-[6px_6px_0px_0px_#000]">
                <div className="flex items-center justify-between mb-12">
                   <div className="flex items-center gap-4">
                      <Zap size={24} className="fill-black" />
                      <h3 className="font-bold text-xl uppercase tracking-tighter">Live Selection Stats</h3>
                   </div>
                   <span className="bg-white border-2 border-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#000]">Active Phase</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <Link href="/register" className="bg-white border-2 border-black rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center hover:translate-x-0.5 hover:translate-y-0.5 shadow-[4px_4px_0px_0px_#000] hover:shadow-none transition-all group">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-4">Registered Teams:</span>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-[#CCFF00] border-2 border-black rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                            <Users2 size={24} />
                         </div>
                         <span className="text-6xl font-black italic tracking-tighter">124</span>
                      </div>
                   </Link>

                   <div className="bg-white border-2 border-black rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_0px_#000]">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-4">Active Nodes:</span>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-black border-2 border-black rounded-full flex items-center justify-center text-[#CCFF00]">
                            <Cpu size={24} />
                         </div>
                         <span className="text-6xl font-black italic tracking-tighter">05</span>
                      </div>
                   </div>
                </div>

                {/* Network Strip */}
                <div className="mt-10 bg-white border-2 border-black rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[3px_3px_0px_0px_#000]">
                   <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-red-100 border-2 border-black rounded-2xl flex items-center justify-center">
                         <WifiOff size={24} className="text-red-500" />
                      </div>
                      <div>
                         <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                           <h5 className="font-black text-xs uppercase tracking-tight">System Connection Offline</h5>
                         </div>
                         <p className="text-[10px] text-zinc-400 font-bold uppercase">Please sign in to establish permanent node link.</p>
                      </div>
                   </div>
                   <Link href="/login" className="bg-[#CCFF00] border-2 border-black px-10 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                      CONNECT NODE
                   </Link>
                </div>
             </div>
          </div>

          {/* Quick Actions Column */}
          <div className="lg:col-span-4">
             <div className="bg-white border-2 border-black rounded-[3rem] p-10 shadow-[6px_6px_0px_0px_#000] h-full flex flex-col">
                <div className="flex items-center justify-between mb-10">
                   <h4 className="font-black text-xl uppercase tracking-tighter italic">Selection Hub</h4>
                   <button className="p-2 hover:bg-zinc-50 border-2 border-black rounded-xl transition-all shadow-[2px_2px_0px_0px_#000] hover:shadow-none">
                      <Plus size={20} />
                   </button>
                </div>

                <div className="space-y-4 flex-grow">
                   <QuickTask icon={<MonitorCheck />} title="Verify ID" desc="Official student credentials." />
                   <QuickTask icon={<Package />} title="Elite Gear" desc="Order official YMCC variants." />
                   <QuickTask icon={<Trophy />} title="Milestones" desc="Track your evaluation points." />
                </div>

                <Link href="/dashboard" className="mt-10 bg-[#CCFF00] border-2 border-black py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-3">
                   LAUNCH PORTAL <ArrowRight size={16} />
                </Link>
             </div>
          </div>
        </div>
      </section>

      {/* 3. UPTIME REWARDS ROADMAP (The 10000% Replication of Grass Feature) */}
      <section className="py-24 container mx-auto px-6 max-w-7xl">
         <div className="bg-white border-2 border-black rounded-[4rem] p-12 md:p-20 shadow-[8px_8px_0px_0px_#000]">
            <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
               <div>
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic mb-4">Milestone Roadmap</h2>
                  <p className="text-zinc-400 font-bold uppercase italic tracking-widest text-sm">Achieve tiers to unlock exclusive nodes.</p>
               </div>
               <div className="bg-[#EBF7D3] border-2 border-black p-8 rounded-[2.5rem] flex items-center gap-8 shadow-[4px_4px_0px_0px_#000]">
                  <div>
                     <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Level Progress:</span>
                     <div className="w-48 h-3 bg-white border-2 border-black rounded-full overflow-hidden">
                        <div className="h-full bg-[#CCFF00]" style={{ width: '55%' }} />
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="text-2xl font-black italic">55.02%</span>
                  </div>
               </div>
            </div>

            <div className="relative pt-20 pb-20 overflow-x-auto no-scrollbar">
               <div className="min-w-[800px] relative">
                  {/* Connecting Line */}
                  <div className="absolute top-12 left-0 w-full h-[3px] bg-zinc-100" />
                  <div className="absolute top-12 left-0 w-[55%] h-[3px] bg-[#CCFF00] z-10" />

                  <div className="flex justify-between relative z-20">
                     <RoadmapTier label="Tier I: Iron" color="bg-zinc-500" progress="0" active />
                     <RoadmapTier label="Tier II: Bronze" color="bg-amber-700" progress="20" active />
                     <RoadmapTier label="Tier III: Silver" color="bg-zinc-300" progress="130" pending />
                     <RoadmapTier label="Tier IV: Gold" color="bg-[#CCFF00]" progress="565" pending />
                  </div>
               </div>
            </div>

            <button className="mt-12 w-full bg-black text-white py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-[0.3em] shadow-[6px_6px_0px_0px_#CCFF00] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
               CLAIM REWARDS
            </button>
         </div>
      </section>

      {/* 4. DEPARTMENT DIRECTORY (Keeping the old content but in new style) */}
      <section className="py-24 container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <CommandCard icon={<Award />} title="COMPETITION" items={['Main Engineering','Theory Level']} color="bg-[#CCFF00]" />
             <CommandCard icon={<HeartHandshake />} title="FUNDRAISING" items={['Link Assets','Public Synergy']} color="bg-red-400" />
             <CommandCard icon={<Calendar />} title="EVENT" items={['Session Sync','Logistics Control']} color="bg-[#CCFF00]" />
             <CommandCard icon={<Settings />} title="OPERATIONAL" items={['Node Sync','Base Audit']} color="bg-red-400" />
             <CommandCard icon={<Tv />} title="MEDIA" items={['Visual Projection','Node Communication']} color="bg-[#CCFF00]" />
             
             <Link href="/register" className="bg-[#CCFF00] border-2 border-black p-10 rounded-[3rem] flex flex-col justify-between hover:bg-black group transition-all shadow-[6px_6px_0px_0px_#000]">
                <h4 className="font-black text-3xl text-black group-hover:text-white uppercase italic tracking-tighter leading-none transition-colors">READY TO JOIN <br/> THE NODE?</h4>
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center transition-all group-hover:bg-[#CCFF00] group-hover:translate-x-2">
                   <ArrowRight className="text-[#CCFF00] group-hover:text-black w-8 h-8" />
                </div>
             </Link>
          </div>
      </section>

      {/* 5. SELECTION FAQ (The Grass-style Chat Help) */}
      <section className="py-24 container mx-auto px-6 max-w-4xl">
         <div className="bg-[#CCFF00] border-2 border-black rounded-[3rem] p-10 mb-[-3rem] relative z-20 shadow-[6px_6px_0px_0px_#000]">
            <h4 className="font-black text-xs uppercase tracking-[0.4em] text-black/40 mb-6">Support Hub</h4>
            <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-none">How can we <br/> help you?</h2>
            
            <button className="mt-12 w-full bg-white border-2 border-black p-8 rounded-[2.5rem] flex items-center justify-between group shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
               <div className="flex items-center gap-8 text-left">
                  <div className="w-16 h-16 bg-[#CCFF00] rounded-2xl border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                     <MessageSquare size={28} />
                  </div>
                  <div>
                     <h5 className="font-black text-xl uppercase tracking-tighter">Start a new chat</h5>
                     <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">Response time: &lt; 5 mins</p>
                  </div>
               </div>
               <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
         </div>
         
         <div className="bg-white border-2 border-black rounded-[4rem] p-12 pt-24 shadow-[8px_8px_0px_0px_#000]">
            <div className="flex items-center justify-between mb-12 border-b border-zinc-50 pb-8">
               <span className="font-black text-xs uppercase tracking-widest text-zinc-300">Operational Inquiries</span>
               <button className="font-black text-[10px] uppercase tracking-widest text-black bg-[#CCFF00] border-2 border-black px-4 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#000]">Explore All</button>
            </div>
            
            <div className="space-y-4">
               {['What is YMCC VII?','How does the selection pipeline work?','What are Node Rewards?','When is the final broadcast?'].map((q, i) => (
                 <div key={i} className="flex items-center justify-between p-7 bg-zinc-50 border-2 border-black rounded-[2rem] hover:bg-white hover:shadow-[4px_4px_0px_0px_#000] transition-all cursor-pointer group">
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

function RoadmapTier({ label, color, progress, active = false, pending = false }: any) {
  return (
    <div className="flex flex-col items-center gap-6 relative">
       <div className={`w-28 h-28 rounded-full border-2 border-black flex items-center justify-center relative overflow-hidden transition-all duration-500 ${active ? 'bg-white shadow-[6px_6px_0px_0px_#CCFF00] scale-110' : 'bg-zinc-50 border-dashed opacity-40'}`}>
          <div className="absolute inset-x-0 bottom-0 h-10 bg-zinc-100 opacity-20" />
          <div className={`w-12 h-12 rounded-lg ${color} border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center`}>
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

function QuickTask({ icon, title, desc }: any) {
  return (
    <div className="bg-zinc-50 border-2 border-black p-6 rounded-[2.5rem] flex items-center gap-6 hover:bg-white hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all cursor-pointer group">
       <div className="w-16 h-16 bg-white border-2 border-black rounded-3xl flex items-center justify-center shadow-inner group-hover:bg-[#CCFF00] transition-all">
          {React.cloneElement(icon, { size: 28 })}
       </div>
       <div className="flex-1">
          <h5 className="font-black text-sm uppercase tracking-tight mb-1">{title}</h5>
          <p className="text-[10px] text-zinc-400 font-bold uppercase italic tracking-tight">{desc}</p>
       </div>
       <div className="p-2 border-2 border-zinc-100 rounded-full group-hover:border-black group-hover:bg-[#CCFF00] transition-all">
          <ChevronRight size={16} />
       </div>
    </div>
  );
}

function CommandCard({ icon, title, items, color }: any) {
  return (
    <div className="bg-white border-2 border-black p-10 rounded-[3rem] group hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[6px_6px_0px_0px_#000] transition-all flex flex-col justify-between">
       <div className={`w-16 h-16 rounded-[1.5rem] border-2 border-black flex items-center justify-center mb-10 ${color} shadow-[3px_3px_0px_0px_#000]`}>
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
    </div>
  );
}
