'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import Link from 'next/link';
import { Fingerprint, Eye, Lock, Database, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-[#001F3F] font-poppins bg-grid-dots relative overflow-x-hidden">
      <div className="absolute top-[-5rem] left-0 w-[40rem] h-[40rem] bg-[#E63E00]/5 rounded-full blur-[120px] -z-10" />
      
      <main className="max-w-4xl mx-auto pt-10 pb-32 px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-[#001F3F]/30 hover:text-[#001F3F] transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-black text-[10px] uppercase tracking-widest">Back to Hub</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <div className="bg-[#E63E00] text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest inline-block mb-6 shadow-[4px_4px_0_0_#001F3F]">
            Data Protection
          </div>
          <h1 className="font-black text-6xl md:text-8xl tracking-tighter uppercase leading-none mb-8">
            Privacy <br/> <span className="text-[#E63E00]">{t('footer.privacy')}.</span>
          </h1>
          <p className="text-xl text-[#001F3F]/40 font-medium leading-relaxed max-w-2xl uppercase italic">
            {lang === 'ID' 
              ? 'YMCC VII menghormati privasi Anda. Kami berkomitmen untuk melindungi data pribadi yang Anda percayakan kepada kami selama kompetisi.'
              : 'YMCC VII respects your privacy. We are committed to protecting the personal data you entrust to us during the competition.'}
          </p>
        </motion.div>

        <div className="space-y-16">
          <PrivacySection 
            icon={<Fingerprint className="w-6 h-6" />}
            title={lang === 'ID' ? 'Pengumpulan Data' : 'Data Collection'}
            content={lang === 'ID' 
              ? 'Kami mengumpulkan informasi identitas seperti Nama, NIM, Institusi, dan alamat email untuk keperluan administrasi sertifikat, ID card, dan komunikasi resmi internal panitia.'
              : 'We collect identity information such as Name, Student ID, Institution, and email address for administrative purposes like certificates, ID cards, and official committee communication.'}
          />

          <PrivacySection 
            icon={<Lock className="w-6 h-6" />}
            title={lang === 'ID' ? 'Keamanan Data' : 'Data Security'}
            content={lang === 'ID' 
              ? 'Data Anda disimpan dalam basis data terenkripsi (Prisma/Supabase) dan hanya dapat diakses oleh staf sekretariat yang memiliki otorisasi (Role Admin).'
              : 'Your data is stored in encrypted databases (Prisma/Supabase) and can only be accessed by authorized secretariat staff (Admin Role).'}
          />

          <PrivacySection 
            icon={<Database className="w-6 h-6" />}
            title={lang === 'ID' ? 'Penggunaan Cookies' : 'Cookies Usage'}
            content={lang === 'ID' 
              ? 'Platform kami menggunakan session cookies untuk menjaga status login Dashboard Anda dan mendeteksi anomali (kecurangan) selama sesi ujian online berlangsung.'
              : 'Our platform uses session cookies to maintain your Dashboard login status and detect anomalies (cheating) during online exam sessions.'}
          />

          <div className="p-10 rounded-[3rem] border-[3px] border-[#001F3F]/5 bg-[#001F3F]/5">
            <h4 className="font-black text-sm uppercase mb-4 tracking-widest text-[#001F3F]">Questions?</h4>
            <p className="text-[#001F3F]/40 text-sm leading-relaxed font-bold mb-6 uppercase italic">
              Jika Anda memiliki pertanyaan mengenai penggunaan data Anda, silakan hubungi tim Media YMCC VII.
            </p>
            <Link href="/contact" className="inline-block bg-[#001F3F] text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#E63E00] transition-all">
              Contact Support
            </Link>
          </div>
        </div>
      </main>

    </div>
  );
}

function PrivacySection({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex flex-col md:flex-row gap-8 md:gap-12"
    >
      <div className="w-16 h-16 bg-[#E63E00]/5 border-[3px] border-[#E63E00]/10 rounded-full flex items-center justify-center shrink-0 text-[#E63E00]">
        {icon}
      </div>
      <div>
        <h3 className="font-black text-3xl uppercase tracking-tighter mb-4">{title}</h3>
        <p className="text-lg text-[#001F3F]/50 font-bold leading-relaxed uppercase">
          {content}
        </p>
      </div>
    </motion.div>
  );
}
