'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import Link from 'next/link';
import { Shield, FileText, Scale, AlertCircle, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-[#001F3F] font-poppins bg-grid-dots relative overflow-x-hidden">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#CCFF00]/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-1/2 left-[-10rem] w-[30rem] h-[30rem] bg-[#E63E00]/5 rounded-full blur-[100px] -z-10" />
      
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
          <div className="bg-[#CCFF00] text-[#001F3F] px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest inline-block mb-6 shadow-[4px_4px_0_0_#001F3F]">
            Legal Document
          </div>
          <h1 className="font-black text-6xl md:text-8xl tracking-tighter uppercase leading-none mb-8">
            Terms of <br/> <span className="text-[#CCFF00] text-stroke-navy">{t('footer.terms')}.</span>
          </h1>
          <p className="text-xl text-[#001F3F]/40 font-medium leading-relaxed max-w-2xl uppercase italic">
            {lang === 'ID' 
              ? 'Selamat datang di ekosistem YMCC VII. Dengan mengakses platform ini, Anda setuju untuk mematuhi aturan main yang kami tetapkan demi keadilan kompetisi.'
              : 'Welcome to the YMCC VII ecosystem. By accessing this platform, you agree to comply with the rules we set for competitive fairness.'}
          </p>
        </motion.div>

        <div className="space-y-16">
          <PolicySection 
            icon={<Shield className="w-6 h-6" />}
            title={lang === 'ID' ? 'Kepatuhan Kompetisi' : 'Competition Compliance'}
            content={lang === 'ID' 
              ? 'Peserta wajib mengikuti seluruh rangkaian acara YMCC VII sesuai jadwal yang ditentukan. Segala bentuk kecurangan dalam sistem seleksi atau ujian online (Exam Center) akan berakibat pada diskualifikasi permanen.'
              : 'Participants must follow all YMCC VII event sequences according to the schedule. Any form of cheating in the selection system or online exam (Exam Center) will result in permanent disqualification.'}
          />

          <PolicySection 
            icon={<FileText className="w-6 h-6" />}
            title={lang === 'ID' ? 'Validitas Data' : 'Data Validity'}
            content={lang === 'ID' 
              ? 'Seluruh data pendaftaran (Nama, NIM, Email) harus valid dan sesuai identitas resmi. YMCC VII tidak bertanggung jawab atas kesalahan pencetakan Sertifikat atau ID Card akibat kelalaian input data oleh peserta.'
              : 'All registration data (Name, Student ID, Email) must be valid and match official identity. YMCC VII is not responsible for any Certificate or ID Card misprints due to data input errors by the participant.'}
          />

          <PolicySection 
            icon={<Scale className="w-6 h-6" />}
            title={lang === 'ID' ? 'Hak Kekayaan Intelektual' : 'Intellectual Property'}
            content={lang === 'ID' 
              ? 'Segala materi video, aset visual, dan platform yang ada di ymccvii.com dimiliki secara sah oleh Departemen Media YMCC VII & ARC Studio. Penggandaan tanpa izin untuk tujuan komersial dilarang keras.'
              : 'All video material, visual assets, and platform contents on ymccvii.com are legally owned by YMCC VII Media Department & ARC Studio. Unauthorized duplication for commercial purposes is strictly prohibited.'}
          />

          <div className="p-10 rounded-[3rem] bg-[#001F3F] text-white border-[3px] border-[#CCFF00]/20 flex flex-col md:flex-row gap-8 items-start shadow-premium">
            <div className="w-12 h-12 bg-[#CCFF00] rounded-full shrink-0 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-[#001F3F]" />
            </div>
            <div>
              <h4 className="font-black text-xl uppercase mb-4 tracking-tighter text-[#CCFF00]">Disclaimer</h4>
              <p className="text-white/60 text-sm leading-relaxed font-bold uppercase italic">
                YMCC VII berhak mengubah syarat dan ketentuan sewaktu-waktu tanpa pemberitahuan sebelumnya. Perubahan akan segera berlaku setelah dipublikasikan di halaman ini.
              </p>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}

function PolicySection({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex flex-col md:flex-row gap-8 md:gap-12"
    >
      <div className="w-16 h-16 bg-[#001F3F]/5 border-[3px] border-[#001F3F]/5 rounded-3xl flex items-center justify-center shrink-0 text-[#001F3F]">
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
