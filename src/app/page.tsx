'use client';

import Link from 'next/link';
import { Navbar } from '@/components/ui/navbar';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

// Animasi bergaya Gojek (Smooth Fade Up & Staggered)
const fadeUpVar: any = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerVar: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const scaleUpVar: any = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
};

export default function RecruitmentPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-zinc-50 text-foreground font-sans overflow-hidden">
      <Navbar />

      <main className="w-full bg-white pt-16">
        
        {/* Marquee Banner Top */}
        <div className="overflow-hidden bg-[#001F3F] py-2 border-b-2 border-white relative z-20">
          <div className="animate-marquee flex gap-12 text-sm font-anton text-white italic whitespace-nowrap tracking-wider">
            {/* Repeat content for smooth marquee */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-12 shrink-0">
                <span>YMCC VII</span>
                <span>THE GREEN COMPASS</span>
                <span>YOUTH MINING CAMP COMPETITION</span>
                <span>SELECTION GUIDE</span>
              </div>
            ))}
          </div>
        </div>


        {/* Header Title / Hero Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerVar}
          className="py-32 px-6 md:px-12 text-center border-b-4 border-[#001F3F] flex flex-col items-center relative overflow-hidden"
        >
          <motion.div variants={fadeUpVar} className="bg-[#E63E00] text-white px-6 py-2 text-sm font-medium uppercase tracking-widest mb-8 shadow-[4px_4px_0_0_#001F3F] border-2 border-[#001F3F] z-10 hover:-translate-y-1 transition-transform">
            {lang === 'ID' ? 'PANDUAN SELEKSI 2026 - 2027' : '2026 - 2027 SELECTION GUIDE'}
          </motion.div>
          <motion.h1 variants={fadeUpVar} className="font-black text-5xl md:text-7xl lg:text-8xl text-[#001F3F] uppercase leading-tight drop-shadow-[4px_4px_0_#CCFF00] z-10">
            YMCC VII <br/> 
            <span className="text-[#E63E00] drop-shadow-[4px_4px_0_#001F3F]">THE GREEN</span><br/>
            COMPASS
          </motion.h1>

          <motion.div variants={scaleUpVar} className="absolute -right-20 -top-20 w-96 h-96 bg-[#CCFF00] rounded-full blur-3xl opacity-30 z-0"></motion.div>
          <motion.div variants={scaleUpVar} className="absolute -left-20 bottom-10 w-72 h-72 bg-[#E63E00] rounded-full blur-3xl opacity-20 z-0"></motion.div>
        </motion.section>

        {/* Protokol & Validasi */}
        <motion.section 
          id="structure" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerVar}
          className="py-24 px-6 md:px-12 border-b-4 border-[#001F3F] bg-[#CCFF00]"
        >
          <motion.h2 variants={fadeUpVar} className="font-heading italic text-6xl md:text-7xl text-[#001F3F] mb-10 uppercase tracking-tight">
            {lang === 'ID' ? 'Protokol & Validasi' : 'Protocol & Validation'}
          </motion.h2>
          <motion.div variants={scaleUpVar} className="bg-white border-4 border-[#001F3F] p-8 md:p-12 shadow-[12px_12px_0_0_#E63E00] max-w-5xl hover:shadow-[16px_16px_0_0_#E63E00] transition-shadow duration-300">
            <p className="font-black text-[#E63E00] mb-6 text-2xl uppercase tracking-wider">{lang === 'ID' ? 'BACA DENGAN TELITI SEBELUM MELANJUTKAN!' : 'READ CAREFULLY BEFORE PROCEEDING!'}</p>
            <p className="mb-8 font-medium text-zinc-900 text-lg leading-relaxed max-w-4xl">
              {lang === 'ID' 
                ? 'YMCC VII mengadopsi sistem pengolahan data otomatis. Kesalahan kecil dalam penulisan akan berdampak fatal pada validitas Sertifikat, ID Card, dan Database resmi.'
                : 'YMCC VII adopts an automated data processing system. Minor writing errors will fatally impact the validity of Certificates, ID Cards, and official Databases.'}
            </p>
            <ul className="space-y-6 font-medium text-base tracking-wide text-[#001F3F]">
              <motion.li variants={fadeUpVar} className="flex items-start"><span className="text-[#E63E00] mr-4 text-2xl leading-none">►</span> <span className="pt-1">{lang === 'ID' ? 'Standardisasi Nama: Wajib menggunakan HURUF KAPITAL sesuai identitas resmi.' : 'Name Standardization: MUST use CAPITAL LETTERS matching official identity.'}</span></motion.li>
              <motion.li variants={fadeUpVar} className="flex items-start"><span className="text-[#E63E00] mr-4 text-2xl leading-none">►</span> <span className="pt-1">{lang === 'ID' ? 'Standardisasi Email: Wajib lowercase.' : 'Email Standardization: MUST be lowercase.'}</span></motion.li>
              <motion.li variants={fadeUpVar} className="flex items-start"><span className="text-[#E63E00] mr-4 text-2xl leading-none">►</span> <span className="pt-1">{lang === 'ID' ? 'Pilihan Divisi: Maksimal memilih 2 divisi. Dokumen ditujukan untuk Pilihan 1.' : 'Division Selection: Can choose max 2 divisions. Documents are directed to 1st Choice.'}</span></motion.li>
              <motion.li variants={fadeUpVar} className="flex items-start"><span className="text-[#E63E00] mr-4 text-2xl leading-none">►</span> <span className="pt-1">{lang === 'ID' ? 'File PDF (Maks. 5MB) format: [PILIHAN 1] _ [NAMA] _ [NIM].' : 'PDF File (Max. 5MB) Format: [1ST CHOICE] _ [NAME] _ [STUDENT ID].'}</span></motion.li>
            </ul>
          </motion.div>
        </motion.section>

        {/* What is YMCC */}
        <motion.section 
          id="about" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerVar}
          className="py-32 px-6 md:px-12 border-b-4 border-[#001F3F] overflow-hidden"
        >
          <motion.h2 variants={fadeUpVar} className="font-heading italic text-6xl md:text-8xl text-[#001F3F] mb-8 uppercase">What is YMCC?</motion.h2>
          <motion.p variants={fadeUpVar} className="text-2xl font-medium max-w-4xl mb-20 text-zinc-700 leading-snug">
            {lang === 'ID' 
              ? 'Kompetisi pertambangan berskala nasional dan internasional yang bertujuan mengembangkan kompetensi teknis, pemikiran strategis, serta kesadaran keberlanjutan generasi muda.'
              : 'A national and international scale mining competition aiming to develop technical competencies, strategic thinking, and sustainability awareness for the young generation.'}
          </motion.p>
          
          <motion.div variants={staggerVar} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            <FeatureCard num="01" title="Strategic Networking" desc="Terhubung dengan mahasiswa, profesional, media, dan mitra internasional." />
            <FeatureCard num="02" title="International Exposure" desc="Sertifikat keterlibatan panitia skala event internasional resmi." />
            <FeatureCard num="03" title="Large-Scale Experience" desc="Pengalaman mengelola event selama 1,5 tahun dengan sistem profesional." />
            <FeatureCard num="04" title="Leadership Growth" desc="Pengembangan skill manajemen tingkat tinggi, komunikasi, dan problem solving." />
          </motion.div>

          {/* Testimonial Quote Gojek Style */}
          <motion.div variants={scaleUpVar} className="bg-[#001F3F] text-white p-12 md:p-16 border-l-[16px] border-[#E63E00] shadow-[8px_8px_0_0_#CCFF00] relative">
            <div className="text-8xl text-[#CCFF00] font-heading absolute -top-8 -left-8 opacity-50">"</div>
            <p className="text-2xl md:text-4xl font-medium italic mb-10 relative z-10 leading-tight">
              Standar yang kita bangun harus mencerminkan nilai inovatif, komprehensif, dan berintegritas. Dinamika pasti ada, namun YMCC VII membawa semangat baru dan wajah baru.
            </p>
            <div className="font-heading text-2xl text-[#E63E00] tracking-wide uppercase">Aghniyo & Faiz Marvel</div>
            <div className="text-lg font-black tracking-widest text-[#CCFF00]">ED & VED YMCC VII</div>
          </motion.div>
        </motion.section>

        {/* Strategic Pillars */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerVar}
          className="py-32 px-4 md:px-8 border-b-4 border-[#001F3F] bg-[#001F3F] text-white"
        >
          <div className="max-w-7xl mx-auto flex flex-col">
            <div className="mb-12">
              <motion.div variants={fadeUpVar} className="bg-[#E63E00] text-white px-3 py-1 font-medium text-[10px] uppercase tracking-widest inline-block mb-4 border border-white">
                STRUCTURE DIRECTORY
              </motion.div>
              <motion.h2 variants={fadeUpVar} className="font-black text-5xl md:text-7xl leading-tight uppercase">
                <span className="text-white">THE STRATEGIC</span><br/>
                <span className="text-[#CCFF00]">PILLARS</span>
              </motion.h2>
            </div>

            {/* Executive Layer */}
            <motion.div variants={scaleUpVar} className="border-4 border-[#CCFF00] p-6 lg:p-10 mb-12 relative w-full">
              <div className="absolute -top-3 left-6 bg-[#CCFF00] text-[#001F3F] px-2 py-0.5 font-medium text-[9px] uppercase tracking-widest">
                EXECUTIVE LAYER
              </div>
              <h3 className="font-heading italic text-4xl text-white uppercase mb-10">BOARD OF DIRECTORS</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border-4 border-[#CCFF00] p-6 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#CCFF00] transition-all flex flex-col justify-center gap-2 group">
                  <span className="text-[#001F3F] font-bold text-[10px] tracking-widest uppercase pb-2 border-b-2 border-zinc-200">EXECUTIVE DIRECTOR</span>
                  <span className="font-heading italic text-xl text-[#E63E00] leading-tight uppercase">Aghniyo H. P. Hermawan</span>
                </div>
                <div className="bg-white border-4 border-[#CCFF00] p-6 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#CCFF00] transition-all flex flex-col justify-center gap-2 group">
                  <span className="text-[#001F3F] font-bold text-[10px] tracking-widest uppercase pb-2 border-b-2 border-zinc-200">VICE EXECUTIVE DIRECTOR</span>
                  <span className="font-heading italic text-xl text-[#E63E00] leading-tight uppercase">Faiz Marvel A. Ridwan</span>
                </div>
                <div className="bg-white border-4 border-[#CCFF00] p-6 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#CCFF00] transition-all flex flex-col justify-center gap-2 group">
                  <span className="text-[#001F3F] font-bold text-[10px] tracking-widest uppercase pb-2 border-b-2 border-zinc-200">SECRETARY I</span>
                  <span className="font-heading italic text-xl text-[#E63E00] leading-tight uppercase">Kartika Rahmadani</span>
                </div>
                <div className="bg-white border-4 border-[#CCFF00] p-6 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#CCFF00] transition-all flex flex-col justify-center gap-2 group">
                  <span className="text-[#001F3F] font-bold text-[10px] tracking-widest uppercase pb-2 border-b-2 border-zinc-200">SECRETARY II</span>
                  <span className="font-heading italic text-xl text-[#E63E00] leading-tight uppercase opacity-50">[TBA]</span>
                </div>
                <div className="bg-white border-4 border-[#CCFF00] p-6 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#CCFF00] transition-all flex flex-col justify-center gap-2 group">
                  <span className="text-[#001F3F] font-bold text-[10px] tracking-widest uppercase pb-2 border-b-2 border-zinc-200">FINANCE DIRECTOR I</span>
                  <span className="font-heading italic text-xl text-[#E63E00] leading-tight uppercase">Rizky Maylandra</span>
                </div>
                <div className="bg-white border-4 border-[#CCFF00] p-6 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#CCFF00] transition-all flex flex-col justify-center gap-2 group">
                  <span className="text-[#001F3F] font-bold text-[10px] tracking-widest uppercase pb-2 border-b-2 border-zinc-200">FINANCE DIRECTOR II</span>
                  <span className="font-heading italic text-xl text-[#E63E00] leading-tight uppercase">Naila Farikiya</span>
                </div>
              </div>
            </motion.div>

            {/* Department Layer Grid */}
            <motion.div variants={staggerVar} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <DeptCard 
                title="COMPETITION" 
                head="KEVIN ANANDA DAUD"
                subs={[
                  { name: "MINING GAMES", lead: "muhammad ashri ananfa hasbi" },
                  { name: "MINING STRATEGY & INNOVATION COMPETITION", lead: "elora naomi yoaasari" },
                  { name: "INTELLECTUAL CHALLENGES", lead: "samoneca yusri zaediawan" },
                  { name: "PAPER COMPETITION", lead: "dizky cardio nur ramadhan" }
                ]}
              />

              <DeptCard 
                title="FUNDRAISING" 
                head="DANI ABDULLAH AL FIKRI"
                subs={[
                  { name: "ENTREPRENEURSHIP", lead: "yusni maula sunarjo" },
                  { name: "SPONSORSHIP", lead: "muhammad aimaz ramadhan" }
                ]}
              />

              <DeptCard 
                title="EVENT" 
                head="STIEVEN VALENTINO SIMANUNGKALIT"
                subs={[
                  { name: "MINING CAMP", lead: "muhammad fariq azzahanif" },
                  { name: "OPENING & CLOSING", lead: "chalisa artanti" },
                  { name: "STUDIUM GENERALE", lead: "rahadian effendhy asdhamara" },
                  { name: "SOCIETY PROJECT", lead: "aldrinniaz sandhio aricho" },
                  { name: "SEMINAR NASIONAL", lead: "adam murzaky kusumandou suhud" },
                  { name: "MINEXPLO", lead: "pilar yudisano sutanto" }
                ]}
              />

              <DeptCard 
                title="OPERATIONAL" 
                head="MARCELLO KAREL ABISENA"
                subs={[
                  { name: "GENERAL AFFAIR", lead: "anmas rifqi hasan" },
                  { name: "LOGISTIC", lead: "ardhiansyah zilha apriyanto" },
                  { name: "CONSUMPTION", lead: "muhammad nail nabil" },
                  { name: "SAFETY, SECURITY, HEALTH, AND CARE", lead: "atama rasiya azari" },
                  { name: "LIAISON OFFICER", lead: "sina rahay soaloon" }
                ]}
              />

              <DeptCard 
                title="MEDIA" 
                head="MUHAMMAD FAIRUZ ADHIMUL ARIFIN"
                subs={[
                  { name: "BRANDING & PUBLIC RELATION", lead: "revina maharani samy" },
                  { name: "CREATIVE PRODUCTION", lead: "arvelyo dzakyawu wandyo" },
                  { name: "SECRETARIAT", lead: "annisa aulia juci" }
                ]}
              />

            </motion.div>
          </div>
        </motion.section>

        {/* Institutional Support */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={staggerVar}
          className="border-b-4 border-[#001F3F] bg-white overflow-hidden py-16"
        >
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6">
            <motion.h2 variants={fadeUpVar} className="font-black text-4xl lg:text-6xl text-[#001F3F] uppercase lg:w-1/3 mb-10 lg:mb-0 text-center lg:text-left leading-tight">
              Institutional<br/>Support.
            </motion.h2>
            <motion.div variants={staggerVar} className="flex flex-wrap items-center justify-center lg:justify-end gap-12 lg:w-2/3">
              <motion.div variants={fadeUpVar} className="flex flex-col items-center">
                <div className="w-32 h-32 bg-zinc-100 border-4 border-[#001F3F] rounded-full flex items-center justify-center mb-4 overflow-hidden p-2 shadow-[4px_4px_0_0_#CCFF00] hover:-translate-y-1 transition-transform">
                  <span className="font-medium text-xs uppercase text-center text-[#001F3F]">UPN Logo</span>
                </div>
                <p className="font-medium text-sm text-[#001F3F] uppercase">UPN "Veteran" YK</p>
              </motion.div>
              <motion.div variants={fadeUpVar} className="flex flex-col items-center">
                <div className="w-32 h-32 bg-zinc-100 border-4 border-[#001F3F] rounded-full flex items-center justify-center mb-4 overflow-hidden p-2 shadow-[4px_4px_0_0_#CCFF00] hover:-translate-y-1 transition-transform">
                  <span className="font-medium text-xs uppercase text-center text-[#001F3F]">HMTA Logo</span>
                </div>
                <p className="font-medium text-sm text-[#001F3F] uppercase">HMTA UPNYK</p>
              </motion.div>
              <motion.div variants={fadeUpVar} className="flex flex-col items-center">
                <div className="w-32 h-32 bg-[#001F3F] border-4 border-[#E63E00] flex items-center justify-center mb-4 shadow-[4px_4px_0_0_#E63E00] hover:-translate-y-1 transition-transform">
                  <span className="font-medium text-xs uppercase text-center text-white p-2">Visual Partner Logo</span>
                </div>
                <p className="font-medium text-sm text-[#001F3F] uppercase">Technical Partner</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Event Core Values  */}
        <motion.section 
          id="vision" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerVar}
          className="py-32 px-6 md:px-12 border-b-4 border-[#001F3F] bg-zinc-100"
        >
          <motion.h2 variants={fadeUpVar} className="font-heading italic text-6xl md:text-8xl text-[#001F3F] mb-20 text-center uppercase">Event Core Values</motion.h2>
          <motion.div variants={staggerVar} className="grid md:grid-cols-3 gap-10">
            <ValueCard title="Academic Excellence" desc="Menjunjung tinggi kualitas dan standar akademik untuk menguji kemampuan teknis dan pola pikir." />
            <ValueCard title="Sustainability by Design" desc="Keberlanjutan menjadi dasar dalam setiap ide, solusi, dan pengambilan keputusan operasional." />
            <ValueCard title="Global Collaboration" desc="Membangun kolaborasi lintas negara dan budaya untuk saling bertukar perspektif global." />
          </motion.div>
        </motion.section>

        {/* General Requirements */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerVar}
          className="bg-[#E63E00] py-32 px-6 md:px-12 border-b-4 border-[#001F3F]"
        >
          <div className="max-w-6xl mx-auto flex flex-col items-center">
            <motion.h2 variants={fadeUpVar} className="font-black text-5xl md:text-8xl text-white uppercase drop-shadow-[4px_4px_0_#001F3F] text-center mb-8 leading-tight">
              REQUIREMENTS
            </motion.h2>
            <motion.p variants={fadeUpVar} className="text-[#001F3F] bg-[#CCFF00] px-6 py-2 border-4 border-[#001F3F] font-black tracking-widest uppercase mb-20 text-center text-lg md:text-xl shadow-[6px_6px_0_0_#001F3F] hover:-translate-y-2 transition-transform duration-300">
              KRITERIA WAJIB CALON PILAR STRATEGIS
            </motion.p>

            <motion.div variants={staggerVar} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              <ReqCard num="01" title="ACADEMIC STATUS" desc="Mahasiswa aktif angkatan 2024 & 2025 dibuktikan dengan KTA/KRS." />
              <ReqCard num="02" title="TIME COMMITMENT" desc="Konsisten hingga seluruh rangkaian agenda berakhir (±1,5 tahun)." />
              <ReqCard num="03" title="GROWTH MINDSET" desc="Ketertarikan pada inovasi, keberlanjutan, dan terbuka pada belajar." />
              <ReqCard num="04" title="ADAPTABILITY" desc="Mampu bekerja dengan dinamika, tahan tekanan, & berorientasi solusi." />
              <ReqCard num="05" title="DIGITAL SKILLS" desc="Mahir platform Google Workspace, Discord, tools manajemen." />
              <ReqCard num="06" title="COMMUNICATION" desc="Berbahasa Indonesia profesional, Bahasa Inggris sebagai nilai plus." />
            </motion.div>
          </div>
        </motion.section>

        {/* C-T-A Area */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={staggerVar}
          className="py-32 bg-white text-center flex flex-col items-center px-6"
        >
          <motion.h2 variants={fadeUpVar} className="font-heading italic text-5xl md:text-7xl text-[#001F3F] uppercase mb-10">
            SIAP MEMBANGUN <span className="text-[#E63E00]">MASA DEPAN?</span>
          </motion.h2>
          <motion.div variants={scaleUpVar}>
            <Link href="/register" className="inline-block bg-[#CCFF00] border-4 border-[#001F3F] text-[#001F3F] font-black text-2xl md:text-4xl px-12 py-6 uppercase tracking-widest hover:bg-[#001F3F] hover:text-[#CCFF00] hover:shadow-[12px_12px_0_0_#E63E00] transition-all duration-300 shadow-[8px_8px_0_0_#E63E00]">
              MULAI REGISTRASI SEKARANG →
            </Link>
          </motion.div>
        </motion.section>

      </main>

      {/* Footer Minimalist */}
      <footer className="bg-[#001F3F] text-white py-16 text-center">
        <div className="font-heading italic text-5xl mb-8 tracking-wide">Y7 <span className="text-[#E63E00]">STRATEGIC</span></div>
        <div className="text-sm font-medium tracking-[0.2em] text-zinc-400 uppercase">
          {lang === 'ID' ? 'Direkayasa dari Kertas Menjadi Kekuatan oleh ARC Studio' : 'Engineered from Paper to Power by ARC Studio'}<br/><br/>
          © 2026 {lang === 'ID' ? 'Departemen Media' : 'Media Department'} YMCC VII
        </div>
      </footer>
    </div>
  );
}

// ---------------- Komponen Kecil Beranimasi ---------------- //

function FeatureCard({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <motion.div variants={fadeUpVar} className="border-4 border-[#001F3F] p-8 shadow-[8px_8px_0_0_#001F3F] bg-white hover:-translate-y-2 hover:shadow-[12px_12px_0_0_#E63E00] transition-all duration-300">
      <div className="font-heading italic text-7xl text-zinc-200 mb-4 font-black">{num}</div>
      <h3 className="font-heading italic text-2xl text-[#001F3F] leading-none mb-4 uppercase">{title}</h3>
      <p className="text-base font-medium text-zinc-600 leading-relaxed">{desc}</p>
    </motion.div>
  )
}

function ValueCard({ title, desc }: { title: string, desc: string }) {
  return (
    <motion.div variants={scaleUpVar} className="border-4 border-[#001F3F] bg-white p-8 shadow-brutal-lg hover:-translate-y-3 transition-transform duration-300 group">
      <h3 className="font-heading italic text-3xl text-[#E63E00] mb-4 group-hover:text-[#001F3F] transition-colors">{title}</h3>
      <p className="font-medium text-base text-zinc-700 leading-relaxed">{desc}</p>
    </motion.div>
  )
}

function ReqCard({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <motion.div variants={fadeUpVar} className="bg-[#001F3F] border-4 border-[#CCFF00] shadow-[8px_8px_0_0_#CCFF00] p-8 text-left hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[16px_16px_0_0_#CCFF00] transition-all duration-300 group">
      <h3 className="font-heading italic text-3xl text-[#CCFF00] mb-4 uppercase group-hover:text-white transition-colors">{num}. {title}</h3>
      <p className="text-white text-base font-semibold leading-relaxed">{desc}</p>
    </motion.div>
  )
}

function DeptCard({ title, head, subs }: { title: string, head: string, subs: {name: string, lead: string}[] }) {
  return (
    <motion.div variants={fadeUpVar} className="bg-white p-6 md:p-8 border-4 border-[#001F3F] flex flex-col hover:-translate-y-2 hover:shadow-[12px_12px_0_0_#E63E00] transition-all group">
      <div className="bg-[#E63E00] text-white px-2 py-0.5 text-[10px] font-black uppercase w-fit tracking-widest mb-3 border-2 border-[#001F3F]">
        DEPARTMENT
      </div>
      <h3 className="font-heading italic text-4xl text-[#001F3F] uppercase mb-4 leading-none group-hover:text-[#E63E00] transition-colors">{title}</h3>
      
      <div className="bg-[#001F3F] p-4 mb-6 relative border-l-4 border-[#CCFF00] hover:translate-x-2 transition-transform">
        <span className="block text-[#CCFF00] font-medium text-[10px] tracking-widest uppercase mb-1">HEAD OF DEPARTMENT</span>
        <span className="block font-heading italic text-2xl text-white uppercase leading-none">{head}</span>
      </div>

      <div className="space-y-4">
        {subs.map((sub, i) => (
          <div key={i} className="border-b-2 border-zinc-100 pb-3 hover:border-[#001F3F] transition-colors group/item">
            <span className="block text-zinc-500 font-medium text-[10px] uppercase tracking-widest mb-1 leading-tight">{sub.name}</span>
            <span className="block font-heading italic text-lg text-black uppercase">{sub.lead}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

