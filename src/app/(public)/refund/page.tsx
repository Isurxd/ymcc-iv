'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import Link from 'next/link';
import { Receipt, RefreshCcw, Ban, CreditCard, ArrowLeft } from 'lucide-react';

export default function RefundPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-[#001F3F] font-poppins bg-grid-dots relative overflow-x-hidden">
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-[#001F3F]/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-10 right-10 w-[30rem] h-[30rem] bg-[#E63E00]/5 rounded-full blur-[100px] -z-10" />
      
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
            Payment Terms
          </div>
          <h1 className="font-black text-6xl md:text-8xl tracking-tighter uppercase leading-none mb-8">
            Refund <br/> <span className="text-[#E63E00]">{t('footer.refund')}.</span>
          </h1>
          <p className="text-xl text-[#001F3F]/40 font-medium leading-relaxed max-w-2xl uppercase italic">
            {lang === 'ID' 
              ? 'Kebijakan pengembalian dana dan pembatalan registrasi YMCC VII dilakukan untuk menjaga transparansi keuangan kompetisi.'
              : 'The YMCC VII refund and registration cancellation policy is established to maintain the financial transparency of the competition.'}
          </p>
        </motion.div>

        <div className="space-y-16">
          <RefundSection 
            icon={<Receipt className="w-6 h-6" />}
            title={lang === 'ID' ? 'Pendaftaran Final' : 'Final Registration'}
            content={lang === 'ID' 
              ? 'Seluruh biaya pendaftaran yang telah diverifikasi (Approved) bersifat final dan tidak dapat dikembalikan dengan alasan apapun setelah masa sanggah berakhir.'
              : 'All verified registration fees (Approved) are final and non-refundable for any reason after the objection period ends.'}
          />

          <RefundSection 
            icon={<Ban className="w-6 h-6" />}
            title={lang === 'ID' ? 'Pembatalan Tim' : 'Team Cancellation'}
            content={lang === 'ID' 
              ? 'Tim yang mengundurkan diri setelah batas waktu pendaftaran ditutup secara otomatis kehilangan hak atas pengembalian dana biaya registrasi.'
              : 'Teams withdrawing after the registration deadline will automatically lose their right to a registration fee refund.'}
          />

          <RefundSection 
            icon={<RefreshCcw className="w-6 h-6" />}
            title={lang === 'ID' ? 'Prosedur Pengembalian' : 'Refund Procedure'}
            content={lang === 'ID' 
              ? 'Pengembalian dana hanya dipertimbangkan dalam kasus force majeure (bencana alam atau pembatalan event oleh otoritas pusat) dengan potongan biaya administrasi sebesar 15%.'
              : 'Refunds are only considered in cases of force majeure (natural disasters or event cancellation by central authorities) with a 15% administrative fee deduction.'}
          />

          <div className="bg-[#001F3F] border-[3px] border-[#E63E00]/20 p-10 rounded-[3rem] shadow-premium">
            <div className="flex gap-4 items-center mb-6">
               <CreditCard className="w-6 h-6 text-[#E63E00]" />
               <h4 className="font-black text-2xl uppercase tracking-tighter text-white">Payment Verification</h4>
            </div>
            <p className="text-white/60 font-bold leading-relaxed uppercase italic">
              {lang === 'ID'
                ? 'Pastikan Anda mengunggah bukti transfer yang valid di Dashboard Peserta. Pembayaran yang tidak terverifikasi dalam waktu 24 jam akan otomatis dibatalkan oleh sistem.'
                : 'Ensure you upload a valid transfer proof in the Participant Dashboard. Payments not verified within 24 hours will be automatically canceled by the system.'}
            </p>
          </div>
        </div>
      </main>

    </div>
  );
}

function RefundSection({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex flex-col md:flex-row gap-8 md:gap-12"
    >
      <div className="w-16 h-16 bg-[#E63E00]/10 border-[3px] border-[#E63E00]/10 rounded-3xl flex items-center justify-center shrink-0 text-[#E63E00]">
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
