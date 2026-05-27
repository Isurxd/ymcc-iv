'use client';

import { Navbar } from '@/components/ui/navbar';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import Link from 'next/link';
import { Cookie, Settings, EyeOff, Info, ArrowLeft } from 'lucide-react';

export default function CookiePage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-[#001F3F] font-sans pb-32 bg-grid-dots relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-[#001F3F]/5 rounded-full blur-[120px] -z-10" />
      
      <main className="max-w-4xl mx-auto pt-40 px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#001F3F] transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-black text-[10px] uppercase tracking-widest">Back to Hub</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <div className="bg-[#001F3F] text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest inline-block mb-6">
            Cookie Usage
          </div>
          <h1 className="font-black text-6xl md:text-8xl tracking-tighter uppercase leading-none mb-8">
            Cookie <br/> <span className="text-zinc-300">Policy.</span>
          </h1>
          <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
            {lang === 'ID' 
              ? 'YMCC VII menggunakan cookies untuk memberikan pengalaman browsing terbaik dan menjaga keamanan sesi pendaftaran Anda.'
              : 'YMCC VII uses cookies to provide the best browsing experience and ensure the security of your registration session.'}
          </p>
        </motion.div>

        <div className="space-y-16">
          <CookieSection 
            icon={<Settings className="w-6 h-6" />}
            title={lang === 'ID' ? 'Cookies Esensial' : 'Essential Cookies'}
            content={lang === 'ID' 
              ? 'Ini adalah cookies yang diperlukan agar website dapat berfungsi. Tanpa cookies ini, fitur login ke Dashboard Peserta dan keranjang belanja Merchandise tidak akan berjalan.'
              : 'These are cookies required for the website to function. Without these, features like Dashboard login and the Merchandise cart will not work.'}
          />

          <CookieSection 
            icon={<EyeOff className="w-6 h-6" />}
            title={lang === 'ID' ? 'Analitik & Performa' : 'Analytics & Performance'}
            content={lang === 'ID' 
              ? 'Kami menggunakan cookies analitik untuk memahami bagaimana pengunjung berinteraksi dengan website kami, membantu kami mengoptimalkan kecepatan muat halaman.'
              : 'We use analytical cookies to understand how visitors interact with our website, helping us optimize page load speeds.'}
          />

          <CookieSection 
            icon={<Cookie className="w-6 h-6" />}
            title={lang === 'ID' ? 'Manajemen Cookies' : 'Cookie Management'}
            content={lang === 'ID' 
              ? 'Anda dapat memilih untuk mematikan cookies melalui pengaturan browser Anda, namun ini mungkin akan merusak fungsionalitas utama pada portal pendaftaran.'
              : 'You can choose to disable cookies through your browser settings, but this may break key functionalities on the registration portal.'}
          />

          <div className="p-10 rounded-[3rem] bg-zinc-50 border border-[#001F3F]/5 flex gap-8 items-start">
            <div className="w-12 h-12 bg-[#001F3F] rounded-full shrink-0 flex items-center justify-center">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-black text-xl uppercase mb-4 tracking-tighter">Your Choice</h4>
              <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                Melanjutkan penggunaan website ini berarti Anda menyetujui penggunaan cookies kami sesuai dengan kebijakan ini.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-10 border-t border-[#001F3F]/10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">
             © 2026 YMCC VII • ENGINEERED BY ARC STUDIO
          </p>
        </div>
      </main>
    </div>
  );
}

function CookieSection({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex flex-col md:flex-row gap-8 md:gap-12"
    >
      <div className="w-16 h-16 bg-[#001F3F]/5 border border-[#001F3F]/10 rounded-3xl flex items-center justify-center shrink-0 text-[#001F3F]">
        {icon}
      </div>
      <div>
        <h3 className="font-black text-3xl uppercase tracking-tighter mb-4">{title}</h3>
        <p className="text-lg text-zinc-500 font-medium leading-relaxed">
          {content}
        </p>
      </div>
    </motion.div>
  );
}
