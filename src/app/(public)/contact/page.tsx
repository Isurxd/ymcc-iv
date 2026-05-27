'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { MessageSquare, Mail, MapPin, Phone, ChevronRight, Zap, ShieldCheck } from 'lucide-react';
import React from 'react';
import AppSwal from '@/lib/swal';

export default function ContactPage() {
  const { lang, t } = useLanguage();

  const handleSupportOpen = () => {
    AppSwal.fire({
      title: 'COORDINATION NODE',
      text: 'Direct communication link initializing...',
      icon: 'info',
      confirmButtonText: 'OPEN CHANNEL',
      confirmButtonColor: '#000'
    });
  }

  return (
    <div className="min-h-screen bg-[#F4F4F5] pt-24 pb-32 font-poppins text-black">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-3 bg-[#CCFF00] border-2 border-black px-4 py-2 rounded-full mb-8 font-black text-[10px] uppercase tracking-[0.3em] shadow-[2px_2px_0px_0px_#000]">
             <MessageSquare size={14} />
             SUPPORT CENTER
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">
            {lang === 'ID' ? 'HUBUNGI' : 'CONTACT'} <br/>
            <span className="text-[#CCFF00] text-stroke-black" style={{ WebkitTextStroke: '2px black' }}>YMCC COMMAND.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           {/* Direct Contact Bento */}
           <div className="lg:col-span-8 flex flex-col gap-10">
              <div className="bg-white border-2 border-black rounded-[4rem] p-12 md:p-16 shadow-[8px_8px_0px_0px_#000] relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                    <Zap size={300} />
                 </div>
                 
                 <div className="relative z-10">
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-12">Communications.</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <ContactNode icon={<Mail />} label="Official Email" value="contact@ymcc.org" />
                       <ContactNode icon={<Phone />} label="Technical Support" value="+62 821 4455 6677" />
                       <ContactNode icon={<MessageSquare />} label="Official Instagram" value="@ymcc_official" />
                       <ContactNode icon={<MapPin />} label="HQ Headquarters" value="UPN 'Veteran' Yogyakarta" />
                    </div>

                    <div className="mt-16 bg-zinc-50 border-2 border-black rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[4px_4px_0px_0px_#000]">
                       <div>
                          <h5 className="font-black text-xs uppercase tracking-tight">Need Immediate Assistance?</h5>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic leading-none mt-1">Our coordination nodes are active 08:00 - 17:00 WIB.</p>
                       </div>
                       <button onClick={handleSupportOpen} className="bg-[#CCFF00] text-black border-2 border-black px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                          START LIVE CHAT
                       </button>
                    </div>
                 </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white border-2 border-black rounded-[4rem] p-12 shadow-[8px_8px_0px_0px_#000]">
                 <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-12">General FAQ.</h3>
                 <div className="space-y-4">
                    <FAQItem question="Bagaimana cara registrasi ulang?" answer="Peserta dapat melakukan registrasi ulang melalui dashboard masing-masing setelah berkas awal diverifikasi oleh admin." />
                    <FAQItem question="Kapan jadwal E-CBT berlangsung?" answer="Jadwal resmi dapat dilihat pada tab Roadmap di beranda atau melalui kalender event pada dashboard." />
                    <FAQItem question="Apakah ada pengiriman fisik untuk merch?" answer="Ya, seluruh pengiriman souvenir akan diproses oleh tim fundraising menggunakan kurir mitra resmi kami." />
                 </div>
              </div>
           </div>

           {/* Sidebar Info */}
           <div className="lg:col-span-4 flex flex-col gap-10">
              <div className="bg-[#CCFF00] border-2 border-black rounded-[3.5rem] p-12 shadow-[8px_8px_0px_0px_#000] text-center">
                 <div className="w-20 h-20 bg-white border-2 border-black rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-[4px_4px_0px_0px_#000]">
                    <ShieldCheck size={40} />
                 </div>
                 <h4 className="font-black text-xl uppercase tracking-widest mb-4 italic">Security Guard</h4>
                 <p className="text-[10px] font-black uppercase text-black/40 tracking-[0.2em] leading-relaxed italic">
                    All communications are encrypted and monitored for participant integrity.
                 </p>
              </div>

              <div className="bg-black text-white border-2 border-black rounded-[3.5rem] p-12 shadow-[8px_8px_0px_0px_#CCFF00] flex-grow relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
                    <Zap size={100} className="text-[#CCFF00]" />
                 </div>
                 <h4 className="text-2xl font-black uppercase tracking-tighter italic text-[#CCFF00] mb-6">HQ Response Node.</h4>
                 <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-10 leading-relaxed">
                    Our team is currently processing high volume of node requests. Average response time: <span className="text-white">14 minutes</span>.
                 </p>
                 <div className="mt-auto">
                    <div className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
                       <span className="text-[9px] font-black uppercase tracking-widest text-[#CCFF00]">System Load: Nominal</span>
                       <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}

function ContactNode({ icon, label, value }: any) {
  return (
    <div className="bg-zinc-50 border-2 border-black p-6 rounded-[2.5rem] hover:bg-white transition-all group cursor-pointer hover:shadow-[4px_4px_0px_0px_#000]">
       <div className="w-12 h-12 bg-white border-2 border-black rounded-2xl flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_#000] group-hover:bg-[#CCFF00] transition-colors">
          {React.cloneElement(icon, { size: 20 })}
       </div>
       <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">{label}</div>
       <div className="text-sm font-black uppercase tracking-tight break-all">{value}</div>
    </div>
  );
}

function FAQItem({ question, answer }: any) {
  return (
    <div className="bg-zinc-50 border-2 border-black p-8 rounded-[2.5rem] hover:bg-white transition-all group overflow-hidden">
       <div className="flex items-center justify-between cursor-pointer">
          <h5 className="font-black text-sm uppercase tracking-tight">{question}</h5>
          <ChevronRight size={18} className="text-zinc-300 group-hover:text-black group-hover:rotate-90 transition-all" />
       </div>
       <p className="mt-4 text-[10px] font-bold text-zinc-500 uppercase italic tracking-widest leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity h-0 group-hover:h-auto overflow-hidden">
          {answer}
       </p>
    </div>
  );
}
