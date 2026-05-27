'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { 
  Zap, Trophy, Store, ArrowRight, Play, Globe, Star, HardHat, ChevronDown, 
  Briefcase, UserCheck, Search, MessageSquare, MonitorCheck, LayoutGrid, Cpu, Users2, DollarSign,
  Award, HeartHandshake, Calendar, Settings, Tv
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function LandingPage() {
  const { t, lang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#001F3F]" />;

  return (
    <div className="min-h-screen bg-white bg-grid-dots relative text-[#001F3F] font-poppins">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center bg-[#001F3F] rounded-b-[4rem] overflow-hidden">
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-[#CCFF00]/5 rounded-full blur-[140px]" />
        
        <div className="container mx-auto px-6 max-w-7xl py-24 flex flex-col lg:flex-row items-center gap-16 relative z-10 w-full">
          <div className="flex-[1.2] text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 bg-white/10 text-[#CCFF00] px-4 py-2 rounded-full mb-8 font-black text-[10px] uppercase tracking-[0.3em] border border-white/10"
            >
               <span className="w-2 h-2 bg-[#CCFF00] rounded-full animate-ping" />
               {t('hero.badge')}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              className="font-black text-6xl md:text-8xl lg:text-[7.5rem] tracking-[-0.05em] leading-[0.8] uppercase mb-10 text-white"
            >
              THE <br/>
              <span className="relative inline-block text-[#CCFF00]">
                GREEN
              </span> <br/>
              <span className="text-[#E63E00] drop-shadow-[0_15px_40px_rgba(230,62,0,0.4)] block mt-4">
                {t('hero.compass')}
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-lg md:text-xl font-bold text-white/40 max-w-xl mb-12 leading-relaxed uppercase italic"
            >
              {t('hero.desc')}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row gap-6">
               <Link href="/register" className="bg-[#CCFF00] text-[#001F3F] px-10 py-5 rounded-full font-black text-base uppercase tracking-widest hover:bg-white transition-all shadow-xl flex items-center justify-center gap-4 group">
                  {t('hero.cta_start')} <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
               </Link>
               <button className="flex items-center gap-5 font-black text-[10px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all group">
                  <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center group-hover:border-[#CCFF00] transition-all">
                    <Play className="w-3 h-3 fill-current translate-x-0.5 text-[#CCFF00]" />
                  </div>
                  {t('hero.cta_watch')}
               </button>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 w-full relative max-w-2xl">
             <div className="aspect-video bg-black rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl relative">
                <iframe 
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/OQ-mfJ2hs58?autoplay=1&mute=1&loop=1&playlist=OQ-mfJ2hs58&controls=0&modestbranding=1&showinfo=0&rel=0" 
                  title="YMCC Cinematic" allow="autoplay; encrypted-media" allowFullScreen
                ></iframe>
             </div>
             <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-3xl border-2 border-[#001F3F] shadow-xl z-20 flex items-center gap-4">
                <img src="/assets/ymcc logo kotak.png" alt="Logo" className="w-10 h-10 object-contain" />
                <div>
                   <div className="font-black text-[8px] uppercase tracking-[0.2em] text-[#E63E00]">OFFICIAL NODE</div>
                   <div className="font-black text-sm text-[#001F3F] tracking-tighter uppercase whitespace-nowrap">EXTRACTING EXCELLENCE</div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 2. STRATEGIC LEADERSHIP */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-left mb-24 border-l-[10px] border-[#CCFF00] pl-10">
              <span className="text-[#E63E00] font-black text-[11px] uppercase tracking-[0.4em] mb-4 block">Strategic Council</span>
              <h2 className="font-black text-5xl md:text-7xl tracking-tighter uppercase leading-none font-poppins">The Strategic <br/> <span className="text-zinc-200 text-stroke-navy">Leadership.</span></h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <MemberCard name="Aghniyo H. P. H." role="Executive Director" dept="HEAD COMMAND" />
              <MemberCard name="Faiz Marvel A. R." role="Vice Executive Director" dept="HEAD COMMAND" />
              <MemberCard name="Rizky Mayfandra" role="Finance Director I" dept="TREASURY NODE" />
              <MemberCard name="Kartika Rahmadani" role="Secretary I" dept="ADMIN NODE" />
           </div>
        </div>
      </section>

      {/* 3. DEPARTMENT DIRECTORY: COMMAND CENTER GRID (RESTORED AS PER IMAGE) */}
      <section className="py-24 px-6 md:px-12">
         <div className="max-w-7xl mx-auto bg-[#001F3F] rounded-[4rem] p-12 md:p-24 relative overflow-hidden">
            <div className="absolute top-10 right-10 flex flex-col items-end opacity-20">
               <span className="text-[120px] font-black italic text-white/10 leading-none">05</span>
               <span className="text-[#CCFF00] font-black text-[10px] uppercase tracking-[0.5em]">Sector Nodes</span>
            </div>
            
            <div className="mb-20">
               <h2 className="font-black text-4xl md:text-7xl uppercase leading-tight tracking-tight italic">
                  <span className="text-white block">DEPARTMENT</span>
                  <span className="text-[#CCFF00] block">DIRECTORY.</span>
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
               <CommandCard icon={<Award />} title="COMPETITION" items={['Main Engineering','Theory Level']} color="[#CCFF00]" />
               <CommandCard icon={<HeartHandshake />} title="FUNDRAISING" items={['Node Assets','Public Synergy']} color="[#E63E00]" />
               <CommandCard icon={<Calendar />} title="EVENT" items={['Session Sync','Logistics Control']} color="[#CCFF00]" />
               <CommandCard icon={<Settings />} title="OPERATIONAL" items={['Node Sync','Base Audit']} color="[#E63E00]" />
               <CommandCard icon={<Tv />} title="MEDIA" items={['Visual Projection','Node Communication']} color="[#CCFF00]" />
               
               {/* Ready to Join Card */}
               <Link href="/register" className="group bg-white/5 border border-white/10 p-10 rounded-[2.5rem] flex flex-col justify-between hover:bg-white/10 transition-all">
                  <h4 className="font-black text-2xl md:text-3xl text-white uppercase italic tracking-tight leading-tight">READY TO JOIN <br/> THE NODE?</h4>
                  <div className="w-16 h-16 bg-[#CCFF00] rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-[#CCFF00]/20">
                     <ArrowRight className="text-[#001F3F] w-8 h-8" />
                  </div>
               </Link>
            </div>
         </div>
      </section>

      {/* 4. INSTITUTIONAL SUPPORT: HEAVY BRUTALISM */}
      <section className="py-32 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-24">
              <h2 className="font-black text-5xl md:text-6xl tracking-tighter uppercase text-[#001F3F] relative inline-block">
                INSTITUTIONAL SUPPORT
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-[6px] bg-[#E63E00] rounded-full" />
              </h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <SupportCard logo="/assets/UPNVY.webp" name="UPN 'VETERAN' YOGYAKARTA" />
              <SupportCard logo="/assets/logo-hmta.png" name="HMTA" />
              <SupportCard icon={<MonitorCheck className="w-12 h-12" />} title="TECHNICAL MEDIA PARTNER" name="ARC STUDIO" />
           </div>
        </div>
      </section>

      {/* 5. SELECTION PIPELINE */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
           <div className="mb-24">
              <h2 className="font-black text-5xl md:text-7xl tracking-tighter uppercase leading-[0.85] mb-8 font-poppins">Selection <br/> <span className="text-[#E63E00]">Pipeline.</span></h2>
              <p className="text-xl font-bold text-[#001F3F]/20 uppercase italic tracking-widest">PHASE EVALUATION PROTOCOL.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <PipelineStep phase="01" title="Socialization" desc="Open Briefing." date="9 March" icon={<Globe />} active />
              <PipelineStep phase="02" title="Submission" desc="Data Entry." date="11 March" icon={<Briefcase />} />
              <PipelineStep phase="03" title="Correction" desc="Verification." date="12 March" icon={<Search />} />
              <PipelineStep phase="04" title="Interview" desc="Mental Sync." date="13 March" icon={<MessageSquare />} />
              <PipelineStep phase="05" title="Broadcast" desc="Final Deployment." date="14 March" icon={<UserCheck />} />
           </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-32 bg-white border-t border-zinc-100">
        <div className="max-w-4xl mx-auto px-6">
           <div className="text-center mb-24">
              <h2 className="font-black text-5xl md:text-7xl tracking-tighter uppercase mb-6 font-poppins">Frequently <br /> <span className="text-zinc-100 text-stroke-navy">Asked.</span></h2>
              <p className="font-bold text-[#001F3F]/20 uppercase tracking-widest text-xs italic italic">Common inquiries.</p>
           </div>
           <div className="space-y-6">
              <FaqItem id={0} q="Apakah boleh memilih lebih dari satu divisi?" a="Ya, Anda diperbolehkan memilih maksimal 2 divisi. Pilihan 1 adalah prioritas utama evaluasi, sedangkan pilihan 2 sebagai rute alternatif jika kuota pilihan 1 telah terpenuhi." isOpen={openFaq === 0} onClick={() => setOpenFaq(openFaq === 0 ? null : 0)} />
              <FaqItem id={1} q="Dokumen apa saja yang harus dikirimkan?" a="Anda wajib menyertakan CV dan Portofolio (KHS bagi angkatan 2024) yang digabung dalam satu file PDF maksimal 5MB." isOpen={openFaq === 1} onClick={() => setOpenFaq(openFaq === 1 ? null : 1)} />
              <FaqItem id={2} q="Bagaimana Correction Window bekerja?" a="Jika terdapat kesalahan teknis, Anda diberikan tenggat 1x24 jam untuk melakukan unggah ulang melalui dashboard." isOpen={openFaq === 2} onClick={() => setOpenFaq(openFaq === 2 ? null : 2)} />
              <FaqItem id={3} q="Bagaimana cara mengetahui pengumuman hasil seleksi?" a="Pengumuman dilakukan secara serentak melalui portal mandiri di website resmi YMCC VII menggunakan Email dan NIM." isOpen={openFaq === 3} onClick={() => setOpenFaq(openFaq === 3 ? null : 0)} />
           </div>
        </div>
      </section>

    </div>
  );
}

// ---------------- UI COMPONENTS ---------------- //

function CommandCard({ icon, title, items, color }: any) {
  return (
    <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] group hover:bg-white/10 transition-all">
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-8 bg-${color} text-[#001F3F]`}>
          {React.cloneElement(icon, { size: 24, strokeWidth: 3 })}
       </div>
       <h4 className="font-black text-xl text-white uppercase italic tracking-tight mb-4">{title}</h4>
       <div className="space-y-1.5">
          {items.map((item: string) => (
             <div key={item} className="flex items-center gap-3">
                <div className={`w-1 h-1 rounded-full bg-${color}`} />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item}</span>
             </div>
          ))}
       </div>
    </div>
  );
}

function SupportCard({ logo, icon, title, name }: any) {
  return (
    <div className="bg-white border-[4px] border-[#001F3F] p-12 rounded-[2.5rem] shadow-[20px_20px_0_0_#001F3F] flex flex-col items-center justify-center text-center gap-10 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[30px_30px_0_0_#CCFF00] transition-all duration-300">
       <div className="h-24 flex items-center justify-center text-[#001F3F]">
          {logo ? <img src={logo} className="h-24 object-contain" alt={name} /> : icon}
       </div>
       <div className="space-y-2">
          {title && <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#001F3F]/40">{title}</p>}
          <h4 className="font-black text-xl uppercase tracking-tighter text-[#001F3F] font-poppins">{name}</h4>
       </div>
    </div>
  );
}

function MemberCard({ name, role, dept }: { name: string, role: string, dept: string }) {
  return (
    <div className="bg-white border-[3px] border-[#001F3F] p-8 rounded-[2.5rem] shadow-[12px_12px_0_0_#001F3F] hover:shadow-[12px_12px_0_0_#CCFF00] transition-all">
       <p className="font-black text-[9px] uppercase tracking-[0.3em] text-[#001F3F]/30 mb-2">{dept}</p>
       <h4 className="font-black text-2xl uppercase tracking-tighter text-[#001F3F] leading-none mb-4 font-poppins">{name}</h4>
       <p className="font-bold text-xs uppercase text-[#E63E00] tracking-widest">{role}</p>
    </div>
  );
}

function PipelineStep({ phase, title, desc, date, icon, active = false }: any) {
  return (
    <div className={`p-8 rounded-[2.5rem] border-[3px] transition-all duration-500 ${active ? 'bg-[#001F3F] text-white border-[#001F3F] shadow-2xl scale-105' : 'bg-white text-[#001F3F]/40 border-zinc-100'}`}>
       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${active ? 'bg-[#CCFF00] text-[#001F3F]' : 'bg-zinc-100 text-zinc-400'}`}>
          {React.cloneElement(icon, { size: 24 })}
       </div>
       <span className={`font-black text-xs uppercase tracking-widest block mb-2 ${active ? 'text-[#CCFF00]' : 'opacity-40'}`}>Phase {phase}</span>
       <h5 className="font-black text-xl uppercase mb-3 tracking-tighter font-poppins">{title}</h5>
       <p className="text-[10px] font-bold uppercase mb-8 opacity-60 leading-tight italic">{desc}</p>
       <div className={`font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full inline-block ${active ? 'bg-white/10 text-white' : 'bg-zinc-50'}`}>{date}</div>
    </div>
  );
}

function FaqItem({ q, a, isOpen, onClick }: any) {
  return (
    <div className={`bg-white border-[3px] rounded-[2.5rem] transition-all duration-500 ${isOpen ? 'border-[#E63E00]' : 'border-zinc-100'}`}>
       <button onClick={onClick} className="w-full p-8 flex items-center justify-between text-left">
          <span className="font-black text-xl uppercase tracking-tighter text-[#001F3F] font-poppins">{q}</span>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-[#E63E00] text-white rotate-180' : 'bg-zinc-100 text-[#001F3F]'}`}><ChevronDown size={24} /></div>
       </button>
       <AnimatePresence>
          {isOpen && (
             <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="px-8 pb-8">
                   <p className="text-xl font-bold text-[#001F3F]/60 uppercase italic font-poppins leading-loose">{a}</p>
                </div>
             </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
}
