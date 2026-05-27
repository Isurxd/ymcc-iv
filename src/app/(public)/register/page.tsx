'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Mail, Lock, ShieldCheck, Zap } from 'lucide-react';
import AppSwal from '@/lib/swal';
import { useLanguage } from '@/lib/LanguageContext';

export default function RegisterPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return AppSwal.fire({ icon: 'error', title: 'GAGAL', text: 'PASSWORD TIDAK SAMA.' });
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: `${formData.firstName} ${formData.lastName}`.trim(), 
          email: formData.email, 
          password: formData.password 
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'REGISTRASI GAGAL');
      }
      AppSwal.fire({
        icon: 'success',
        title: 'BERHASIL',
        text: 'Identitas tim divalidasi. Silakan login.',
      }).then(() => {
        router.push('/login');
      });
    } catch (err: any) {
      AppSwal.fire({ icon: 'error', title: 'GAGAL', text: err.message.toUpperCase() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] bg-grid-black/[0.02] relative font-poppins pt-24 pb-48">
      
      {/* Background Cinematic Accents */}
      <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-[#CCFF00]/10 rounded-full blur-[160px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10rem] left-[-10rem] w-[50rem] h-[50rem] bg-[#E63E00]/5 rounded-full blur-[140px] -z-10" />

      <div className="max-w-[90rem] mx-auto px-8 md:px-16 flex flex-col lg:flex-row gap-32 items-center relative z-10">
        
        {/* Left Side: Context & Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="flex-1 lg:pr-12"
        >
          <div className="inline-flex items-center gap-4 bg-white border border-zinc-100 px-5 py-2.5 rounded-full mb-12 shadow-sm">
             <div className="w-2 h-2 bg-[#E63E00] rounded-full animate-ping" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#001F3F]/60">
               {t('auth.onboarding')}
             </span>
          </div>
          
          <h1 className="font-black text-7xl md:text-8xl lg:text-9xl tracking-[-0.06em] uppercase leading-[0.82] text-[#001F3F] mb-12">
            {t('hero.title_1')} <br/> 
            <span className="text-white text-stroke-navy">{t('hero.title_2')}</span> <br/> 
            <span className="text-[#E63E00] drop-shadow-2xl">{t('hero.compass')}</span> <br/> 
            <span className="text-3xl md:text-5xl tracking-tighter opacity-10">{lang === 'ID' ? 'MENANGGAPI.' : 'IS WAITING.'}</span>
          </h1>

          <div className="grid grid-cols-1 gap-6 max-w-xl">
            <FeatureBox title={t('auth.onboarding')} desc="Full access to centralized administration and selection updates." />
            <FeatureBox title="Strategic Pipeline" desc="Real-time document verification and credential monitoring." />
          </div>
        </motion.div>

        {/* Right Side: Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, delay: 0.2 }}
          className="flex-1 w-full max-w-3xl"
        >
          <div className="bg-white/80 backdrop-blur-3xl border-[1px] border-white/60 rounded-[5rem] p-12 md:p-20 shadow-[0_100px_150px_-50px_rgba(0,31,63,0.15)] relative group">
            <div className="absolute top-10 right-10 text-[120px] font-black text-zinc-50 select-none">01</div>
            
            <h2 className="font-black text-5xl text-[#001F3F] uppercase tracking-tighter mb-16 italic relative z-10">
               {t('auth.register_title')}
            </h2>
            
            <form onSubmit={onSubmit} className="space-y-10 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-[#001F3F]/30 uppercase tracking-widest pl-6 italic">{t('auth.first_name')}</label>
                  <input id="firstName" value={formData.firstName} onChange={handleChange} required placeholder="JOHN" className="w-full bg-[#F8F9FA] border-[2px] border-zinc-100 rounded-full py-6 px-10 font-bold text-lg text-[#001F3F] focus:outline-none focus:border-[#001F3F] transition-all placeholder:text-zinc-200" />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-[#001F3F]/30 uppercase tracking-widest pl-6 italic">{t('auth.last_name')}</label>
                  <input id="lastName" value={formData.lastName} onChange={handleChange} required placeholder="DOE" className="w-full bg-[#F8F9FA] border-[2px] border-zinc-100 rounded-full py-6 px-10 font-bold text-lg text-[#001F3F] focus:outline-none focus:border-[#001F3F] transition-all placeholder:text-zinc-200" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-[#001F3F]/30 uppercase tracking-widest pl-6 italic">{t('auth.email_label')}</label>
                <div className="relative">
                  <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-[#001F3F]/20" />
                  <input id="email" type="email" value={formData.email} onChange={handleChange} required placeholder="team@university.edu" className="w-full bg-[#F8F9FA] border-[2px] border-zinc-100 rounded-full py-6 pl-16 pr-10 font-bold text-lg text-[#001F3F] focus:outline-none focus:border-[#001F3F] transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-[#001F3F]/30 uppercase tracking-widest pl-6 italic">{t('auth.password_label')}</label>
                  <div className="relative">
                    <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-[#001F3F]/20" />
                    <input id="password" type="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className="w-full bg-[#F8F9FA] border-[2px] border-zinc-100 rounded-full py-6 pl-16 pr-10 font-bold text-lg text-[#001F3F] focus:outline-none focus:border-[#001F3F] transition-all" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-[#001F3F]/30 uppercase tracking-widest pl-6 italic">{t('auth.confirm_password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-[#001F3F]/20" />
                    <input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required placeholder="••••••••" className="w-full bg-[#F8F9FA] border-[2px] border-zinc-100 rounded-full py-6 pl-16 pr-10 font-bold text-lg text-[#001F3F] focus:outline-none focus:border-[#001F3F] transition-all" />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 px-6 pt-6">
                <div className="relative">
                   <input type="checkbox" required className="peer w-7 h-7 bg-[#F8F9FA] border-2 border-zinc-200 rounded-xl appearance-none checked:bg-[#CCFF00] checked:border-[#CCFF00] transition-all cursor-pointer" />
                   <div className="absolute top-1.5 left-1.5 text-[#001F3F] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                      <Check className="w-4 h-4 stroke-[4px]" />
                   </div>
                </div>
                <p className="text-[12px] font-bold text-[#001F3F]/40 uppercase tracking-tight leading-relaxed italic">{t('auth.terms_agree')}</p>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#001F3F] text-white py-8 rounded-[3.5rem] font-black text-2xl uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#001F3F] transition-all shadow-[0_40px_80px_-20px_rgba(0,31,63,0.3)] active:scale-95 flex items-center justify-center gap-6 group">
                {loading ? t('auth.processing') : t('auth.register_btn')} 
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:translate-x-3 group-hover:bg-[#CCFF00] group-hover:text-[#001F3F] transition-all duration-500">
                  <ArrowRight className="w-6 h-6 stroke-[3px]" />
                </div>
              </button>
            </form>

            <div className="mt-16 text-center">
               <span className="text-[11px] font-black text-[#001F3F]/10 uppercase tracking-[0.5em] block mb-6">Security Clearance Required</span>
               <p className="text-[12px] font-black uppercase text-[#001F3F]/30 italic">
                 {t('auth.already_user')} 
                 <Link href="/login" className="text-[#E63E00] hover:underline ml-4 border-b-2 border-transparent hover:border-[#E63E00] pb-1 transition-all">
                   {t('nav.login')}
                 </Link>
               </p>
            </div>
          </div>
          <div className="mt-12 text-center opacity-10 font-black text-7xl italic pointer-events-none select-none">YMCC VII 2026.4</div>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureBox({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="bg-white/40 backdrop-blur-md border-[2px] border-white/60 p-10 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex items-start gap-10 hover:shadow-2xl transition-all duration-700 group cursor-default">
       <div className="w-16 h-16 bg-[#001F3F] text-[#CCFF00] rounded-3xl flex items-center justify-center shrink-0 group-hover:rotate-[15deg] transition-transform shadow-xl">
          <Zap className="w-8 h-8 fill-current" />
       </div>
       <div>
          <h4 className="font-black text-3xl text-[#001F3F] uppercase tracking-tighter mb-4">{title}</h4>
          <p className="font-bold text-sm text-[#001F3F]/40 leading-relaxed italic uppercase">{desc}</p>
       </div>
    </div>
  );
}
