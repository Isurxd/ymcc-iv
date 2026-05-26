'use client';

import Link from 'next/link';
import { Navbar } from '@/components/ui/navbar';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { useState, useEffect } from 'react';
import { Shield, Lock, Settings, Download, UserPlus, Zap, CheckCircle2, Globe, ArrowRight, X } from 'lucide-react';

// Grass.io Style Animations
const fadeUpVar: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerVar: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const scaleUpVar: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function LandingPage() {
  const { lang } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white text-[#001F3F] font-sans overflow-hidden bg-grid-dots">
      <Navbar />

      <main className="w-full">
        
        {/* HERO SECTION: TEXT LEFT, IMAGE RIGHT */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerVar}
          className="pt-40 md:pt-60 pb-32 md:pb-56 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20 relative"
        >
          {/* Decorative Ambient Orbs */}
          <div className="absolute top-0 left-0 w-[50rem] h-[50rem] bg-[#CCFF00]/10 rounded-full blur-[140px] -z-10" />
          <div className="absolute bottom-[-10rem] right-[-10rem] w-[40rem] h-[40rem] bg-[#E63E00]/5 rounded-full blur-[140px] -z-10" />

          {/* LEFT: CONTENT */}
          <div className="flex-[1.2] text-left z-10">
            <motion.div variants={fadeUpVar} className="inline-flex items-center gap-3 bg-[#001F3F]/5 border border-[#001F3F]/10 px-5 py-2 rounded-full mb-10">
               <span className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse shadow-[0_0_12px_#CCFF00]" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#001F3F]/60">
                 {lang === 'ID' ? 'REGISTRASI YMCC VII DIBUKA' : 'YMCC VII REGISTRATION OPEN'}
               </span>
            </motion.div>
            
            <motion.h1 variants={fadeUpVar} className="font-black text-6xl md:text-8xl lg:text-[7.5rem] xl:text-[9rem] tracking-[-0.04em] leading-[0.82] mb-12 uppercase">
              THE DATA <br/> LAYER <br/>
              <span className="text-[#CCFF00] drop-shadow-[0_15px_40px_rgba(204,255,0,0.35)]">FOR AI.</span>
            </motion.h1>

            <motion.p variants={fadeUpVar} className="text-xl md:text-2xl font-medium text-zinc-400 mb-14 max-w-2xl leading-relaxed">
              {lang === 'ID' 
                ? 'Bergabunglah dalam revolusi sistem pertambangan masa depan. Kelola tim, verifikasi data, dan bangun masa depan teknologi hijau bersama YMCC VII.'
                : 'Join the revolution of future mining systems. Manage teams, verify data, and build the future of green technology with YMCC VII.'}
            </motion.p>

            <motion.div variants={fadeUpVar} className="flex flex-col sm:flex-row gap-6">
               <Link href="/register" className="bg-[#CCFF00] text-[#001F3F] px-14 py-6 rounded-full font-black text-xl uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-[#CCFF00]/30 flex items-center justify-center gap-3">
                  {lang === 'ID' ? 'DAFTAR SEKARANG' : 'GET STARTED'} <ArrowRight className="w-5 h-5" />
               </Link>
               <Link href="#about" className="bg-white/50 backdrop-blur-sm border border-[#001F3F]/10 text-[#001F3F] px-14 py-6 rounded-full font-black text-xl uppercase tracking-widest hover:bg-[#001F3F]/10 transition-all flex items-center justify-center">
                  {lang === 'ID' ? 'PELAJARI' : 'LEARN MORE'}
               </Link>
            </motion.div>
          </div>

          {/* RIGHT: IMAGE */}
          <motion.div 
            variants={scaleUpVar} 
            className="flex-1 relative w-full"
          >
             <div className="relative rounded-[5rem] p-6 bg-white/20 backdrop-blur-3xl border border-white/50 shadow-premium overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#CCFF00]/15 to-transparent pointer-events-none" />
                <img 
                  src="/assets/hero-mockup.png" 
                  alt="Dashboard View" 
                  className="w-full h-auto rounded-[4rem] shadow-2xl transition-all duration-1000 group-hover:scale-105 group-hover:rotate-1"
                />
             </div>
             
             {/* Floating UI Elements */}
             <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
               className="absolute -top-10 -right-10 bg-white p-6 rounded-[3rem] shadow-premium flex flex-col items-center gap-2 border border-[#001F3F]/5 z-20"
             >
                <div className="w-16 h-16 bg-[#CCFF00] rounded-full flex items-center justify-center shadow-lg">
                   <Zap className="w-8 h-8 text-[#001F3F]" />
                </div>
                <span className="font-black text-[10px] text-[#001F3F] uppercase tracking-widest">Active Node</span>
             </motion.div>
          </motion.div>
        </motion.section>

        {/* MARQUEE LOGOS SECTION */}
        <div className="py-24 border-y border-[#001F3F]/5 bg-white/50 backdrop-blur-sm">
           <div className="max-w-7xl mx-auto px-6 mb-16 flex items-center gap-10">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 shrink-0">Official Partners</span>
              <div className="h-[1px] w-full bg-[#001F3F]/5" />
           </div>
           
           <div className="relative flex overflow-hidden">
             <div className="animate-marquee flex gap-24 items-center whitespace-nowrap grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
               {[...Array(12)].map((_, i) => (
                 <div key={i} className="flex gap-24 items-center shrink-0">
                    <img src="/assets/logo-hmta.png" alt="HMTA" className="h-12 w-auto object-contain" />
                    <span className="font-black text-4xl text-zinc-300 italic tracking-tighter">UPN VETERAN YK</span>
                    <Globe className="text-zinc-300 w-8 h-8" />
                    <span className="font-black text-4xl text-zinc-300 italic tracking-tighter">ARC STUDIO</span>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* FEATURE SECTION */}
        <section id="about" className="py-40 md:py-60 px-6 max-w-7xl mx-auto">
           <div className="grid lg:grid-cols-2 gap-20 items-end mb-32">
              <div>
                 <h2 className="font-black text-5xl md:text-8xl tracking-tight leading-[0.9] mb-10">
                    BUILT FOR THE <br/> <span className="text-[#CCFF00]">COMMUNITY.</span>
                 </h2>
                 <p className="text-xl md:text-2xl font-medium text-zinc-400 leading-relaxed max-w-xl">
                   Platform terintegrasi yang dirancang khusus untuk mengelola kompetisi pertambangan dengan presisi data tingkat tinggi dan transparansi total.
                 </p>
              </div>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              <FeatureCard num="01" title="Node Monitoring" desc="Pantau performa dan pendaftaran tim secara real-time melalui dashboard interaktif." />
              <FeatureCard num="02" title="Secure Bridge" desc="Integrasi pembayaran otomatis yang terverifikasi secara instan oleh sistem cerdas." />
              <FeatureCard num="03" title="Validator Engine" desc="Sistem penilaian (CBT) yang adil dengan deteksi anomali perilaku otomatis." />
              <FeatureCard num="04" title="Digital Asset" desc="Setiap pencapaian tim didokumentasikan dalam sertifikat digital terverifikasi." />
           </div>
        </section>

        {/* REPLICATING THE 'INFRASTRUCTURE' DARK SECTION */}
        <section className="mx-4 md:mx-10 py-32 md:py-56 px-6 bg-[#001F3F] rounded-[5rem] md:rounded-[10rem] relative overflow-hidden mb-40">
           <div className="absolute inset-0 bg-grid-dots opacity-5" />
           
           <div className="max-w-7xl mx-auto relative z-10">
              <div className="flex flex-col items-center text-center mb-32">
                 <div className="bg-[#CCFF00] text-[#001F3F] px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-10">
                    Infrastructure Layer
                 </div>
                 <h2 className="font-black text-6xl md:text-8xl lg:text-[9rem] text-white tracking-tighter leading-[0.8] mb-12 uppercase">
                    THE STRATEGIC <br/> <span className="text-[#CCFF00]">PILLARS.</span>
                 </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                 <DeptCard 
                    title="COMPETITION" 
                    head="KEVIN ANANDA DAUD"
                    subs={[
                      { name: "MINING GAMES", lead: "M. ASHRI ANANFA H." },
                      { name: "STRATEGY & INNOVATION", lead: "ELORA NAOMI Y." },
                      { name: "PAPER COMPETITION", lead: "DIZKY CARDIO N." }
                    ]}
                 />
                 <DeptCard 
                    title="EVENT" 
                    head="STIEVEN VALENTINO S."
                    subs={[
                      { name: "MINING CAMP", lead: "M. FARIQ AZZAHANIF" },
                      { name: "OPENING & CLOSING", lead: "CHALISA ARTANTI" },
                      { name: "SEMINAR NASIONAL", lead: "ADAM MURZAKY K." }
                    ]}
                 />
                 <DeptCard 
                    title="OPERATIONAL" 
                    head="MARCELLO KAREL A."
                    subs={[
                      { name: "GENERAL AFFAIR", lead: "ANMAS RIFQI HASAN" },
                      { name: "LOGISTIC", lead: "ARDHIANSYAH Z. A." },
                      { name: "SAFETY & CARE", lead: "ATAMA RASIYA AZARI" }
                    ]}
                 />
              </div>
           </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-60 px-6 text-center relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-[#CCFF00]/5 rounded-full blur-[150px] -z-10" />
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="max-w-5xl mx-auto flex flex-col items-center"
           >
              <h2 className="font-black text-6xl md:text-[10rem] tracking-[-0.05em] leading-[0.8] mb-20 uppercase">
                 READY TO <br />
                 <span className="text-[#E63E00]">ASCEND?</span>
              </h2>
              <Link href="/register" className="bg-[#001F3F] text-[#CCFF00] px-20 py-10 rounded-[4rem] font-black text-3xl uppercase tracking-[0.2em] shadow-premium hover:scale-105 transition-all">
                 INITIALIZE NODE →
              </Link>
           </motion.div>
        </section>

      </main>

      {/* REPLICATED FOOTER */}
      <footer className="bg-white py-32 px-6 border-t border-[#001F3F]/5">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-20">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#001F3F] rounded-full flex items-center justify-center">
                      <span className="font-black text-white italic text-xl">Y7</span>
                  </div>
                  <span className="font-black text-4xl tracking-tighter uppercase">YMCC VII</span>
                </div>
                <p className="text-zinc-400 font-medium max-w-sm">The Official Youth Mining Camp Competition Ecosystem 2026. Join theStake.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-20">
               <div className="flex flex-col gap-6">
                  <span className="font-black text-[10px] uppercase tracking-widest text-[#001F3F]">Explore</span>
                  <Link href="/register" className="text-zinc-400 hover:text-[#001F3F] transition-colors text-sm font-medium">Register</Link>
                  <Link href="/about" className="text-zinc-400 hover:text-[#001F3F] transition-colors text-sm font-medium">About</Link>
                  <Link href="/merch" className="text-zinc-400 hover:text-[#001F3F] transition-colors text-sm font-medium">Store</Link>
               </div>
               <div className="flex flex-col gap-6">
                  <span className="font-black text-[10px] uppercase tracking-widest text-[#001F3F]">System</span>
                  <Link href="/docs" className="text-zinc-400 hover:text-[#001F3F] transition-colors text-sm font-medium">Docs</Link>
                  <Link href="/status" className="text-zinc-400 hover:text-[#001F3F] transition-colors text-sm font-medium">Status</Link>
                  <Link href="/contact" className="text-zinc-400 hover:text-[#001F3F] transition-colors text-sm font-medium">Support</Link>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-[#001F3F]/5 flex flex-col md:flex-row justify-between gap-10">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">
               © 2026 MEDIA DEPT • ENGINEERED BY ARC STUDIO
            </div>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
               <Link href="/privacy">Privacy Policy</Link>
               <Link href="/terms">Terms of Service</Link>
            </div>
         </div>
      </footer>
    </div>
  );
}

// ---------------- Grass.io Custom Components ---------------- //

function FeatureCard({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <motion.div variants={fadeUpVar} className="bg-white p-14 rounded-[5rem] shadow-soft hover:shadow-premium transition-all duration-1000 group border border-[#001F3F]/5">
      <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center font-black text-xl text-[#001F3F] mb-12 group-hover:bg-[#CCFF00] transition-colors duration-500">{num}</div>
      <h3 className="font-black text-4xl mb-6 tracking-tighter uppercase leading-[0.9]">{title}</h3>
      <p className="text-md font-medium text-zinc-400 leading-relaxed uppercase italic opacity-60">{desc}</p>
    </motion.div>
  )
}

function DeptCard({ title, head, subs }: { title: string, head: string, subs: {name: string, lead: string}[] }) {
  return (
    <motion.div variants={fadeUpVar} className="glass-morphism p-14 rounded-[6rem] flex flex-col border border-white/10 group transition-all duration-700 hover:bg-white/10">
      <div className="bg-[#CCFF00] text-[#001F3F] px-4 py-1.5 rounded-full text-[9px] font-black uppercase w-fit tracking-widest mb-10">
        STRUCTURAL LAYER
      </div>
      <h3 className="font-black text-5xl text-white uppercase mb-6 tracking-[-0.05em] leading-none group-hover:text-[#CCFF00] transition-colors">{title}</h3>
      
      <div className="mb-14">
        <span className="block text-white/30 font-black text-[9px] tracking-[0.4em] uppercase mb-3 text-left">CHIEF OF PILLAR</span>
        <span className="block font-black text-3xl text-white uppercase leading-none">{head}</span>
      </div>

      <div className="space-y-10">
        {subs.map((sub, i) => (
          <div key={i} className="border-t border-white/5 pt-6 group/item">
            <span className="block text-white/20 font-black text-[10px] uppercase tracking-[0.2em] mb-2">{sub.name}</span>
            <span className="block font-black text-xl text-white/90 uppercase group-hover/item:text-[#CCFF00] transition-colors">{sub.lead}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
