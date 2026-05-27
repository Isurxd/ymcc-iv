'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { Shield, Target, Users, Quote, ArrowUpRight } from 'lucide-react';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white bg-grid-dots relative text-[#001F3F] font-poppins pt-20 pb-32">
      
      {/* Brand Background Accents */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#CCFF00]/5 rounded-full blur-[140px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10rem] left-[-10rem] w-[40rem] h-[40rem] bg-[#E63E00]/5 rounded-full blur-[140px] -z-10" />

      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24"
        >
          <div className="inline-flex items-center gap-3 bg-[#001F3F]/5 border border-[#001F3F]/10 px-5 py-2 rounded-full mb-10">
             <span className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse shadow-[0_0_12px_#CCFF00]" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#001F3F]/60">
               Established Since 2018
             </span>
          </div>

          <h1 className="font-black text-6xl md:text-[8rem] tracking-[-0.05em] leading-[0.85] uppercase mb-12">
            The Green <br/> <span className="text-[#E63E00] drop-shadow-[0_20px_50px_rgba(230,62,0,0.2)]">Compass.</span>
          </h1>

          <p className="text-xl md:text-3xl font-bold text-[#001F3F]/40 max-w-4xl leading-relaxed uppercase italic">
            &quot;Sistem navigasi strategis yang dirancang untuk memandu talenta terbaik pertambangan menuju masa depan ekstraksi yang berkelanjutan.&quot;
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-32">
          <div className="space-y-10">
            <h3 className="font-black text-5xl uppercase tracking-tighter italic border-l-[12px] border-[#CCFF00] pl-8 py-2">
              Our Legacy.
            </h3>
            <p className="text-xl md:text-2xl font-bold text-[#001F3F]/60 leading-relaxed uppercase">
              YMCC telah berkembang dari kompetisi lokal menjadi ekosistem pendidikan dan profesionalisme pertambangan yang terintegrasi penuh.
            </p>
            <p className="text-xl md:text-2xl font-bold text-[#001F3F]/40 leading-relaxed uppercase italic opacity-60">
              Melalui navigasi yang presisi, kami mencetak pemimpin yang tidak hanya mahir teknis, tapi juga bijak dalam strategi keberlanjutan.
            </p>
          </div>

          <div className="bg-[#001F3F] text-white p-14 rounded-[4rem] shadow-[20px_20px_0_0_#CCFF00] relative overflow-hidden group hover:shadow-[10px_10px_0_0_#E63E00] transition-all duration-500">
             <div className="absolute top-0 right-0 w-40 h-40 bg-[#CCFF00]/10 rounded-full blur-3xl opacity-20" />
             <Quote className="w-16 h-16 text-[#CCFF00] mb-8 opacity-40 shrink-0" />
             <p className="text-3xl md:text-4xl font-black uppercase italic tracking-tight leading-tight mb-12">
               &quot;The mining industry is evolving. We are the compass that points towards responsible and innovative digital extraction.&quot;
             </p>
             <div className="pt-8 border-t border-white/10">
                <span className="block font-black text-base tracking-widest text-[#CCFF00]">YMCC STRATEGIC COMMAND</span>
                <span className="block text-[10px] uppercase opacity-40 font-bold mt-1 tracking-widest">VISION 2026 / NODE: ALPHA</span>
             </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <ValueCard icon={<Shield className="w-10 h-10" />} title="Integrity" desc="Menjaga kejujuran akademik dan profesional dalam setiap kompetisi." />
           <ValueCard icon={<Target className="w-10 h-10 text-[#E63E00]" />} title="Innovation" desc="Mengadopsi teknologi digital terbaru dalam metodologi ekstraksi." />
           <ValueCard icon={<Users className="w-10 h-10" />} title="Synergy" desc="Membangun jaringan lintas institusi untuk kemajuan industri." />
        </div>
      </div>
    </div>
  );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-12 rounded-[4rem] border-[3px] border-zinc-100 hover:border-[#001F3F] hover:shadow-2xl transition-all duration-500 group">
       <div className="w-20 h-20 bg-[#001F3F]/5 text-[#001F3F] rounded-3xl flex items-center justify-center mb-10 group-hover:bg-[#001F3F] group-hover:text-[#CCFF00] transition-all shadow-sm">
         {icon}
       </div>
       <h4 className="font-black text-4xl uppercase tracking-tighter mb-6">{title}</h4>
       <p className="text-[#001F3F]/40 font-bold text-sm leading-relaxed uppercase italic">
         {desc}
       </p>
    </div>
  );
}
