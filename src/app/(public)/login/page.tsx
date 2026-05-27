'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck, Fingerprint } from 'lucide-react';
import AppSwal from '@/lib/swal';
import { useLanguage } from '@/lib/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await res.json();
      if (data.user.role === 'SUPERADMIN') router.push('/superadmin');
      else if (data.user.role === 'ADMIN') router.push('/admin');
      else if (data.user.role === 'OPERATOR') router.push('/operator');
      else if (data.user.role === 'FUNDRAISING') router.push('/fundraising');
      else router.push('/dashboard');
      
    } catch (err: any) {
      AppSwal.fire({
        icon: 'error',
        title: 'LOGIN GAGAL',
        text: err.message.toUpperCase(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] bg-grid-black/[0.02] relative font-poppins pt-20 pb-32">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10rem] right-[-10rem] w-[70rem] h-[70rem] bg-[#CCFF00]/10 rounded-full blur-[180px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10rem] left-[-10rem] w-[50rem] h-[50rem] bg-[#E63E00]/5 rounded-full blur-[140px] -z-10" />

      <div className="container mx-auto px-6 flex flex-col items-center justify-center relative z-10">
        
        {/* Superior Branding Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-16"
        >
           <div className="w-28 h-28 bg-[#001F3F] rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-[0_30px_60px_-15px_rgba(0,31,63,0.4)] relative group cursor-wait">
              <div className="absolute inset-0 bg-[#CCFF00] rounded-[2.5rem] scale-0 group-hover:scale-100 transition-transform duration-700 -z-10" />
              <img src="/assets/ymcc logo kotak.png" className="w-16 h-16 object-contain" alt="Logo" />
           </div>
           <div className="inline-flex items-center gap-3 bg-white border border-zinc-100 px-4 py-2 rounded-full mb-6 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#001F3F]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#001F3F]/40">Node Access Verification</span>
           </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-xl"
        >
          <div className="bg-white/80 backdrop-blur-3xl border-[1px] border-white/40 rounded-[5rem] px-10 md:px-16 py-20 shadow-[0_80px_150px_-30px_rgba(0,31,63,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Fingerprint className="w-40 h-40 text-[#001F3F]" />
            </div>

            <div className="mb-16 relative">
              <h1 className="font-black text-6xl text-[#001F3F] uppercase tracking-tighter mb-4 leading-none">
                {t('auth.login_title')}
              </h1>
              <p className="font-bold text-sm text-[#001F3F]/30 uppercase tracking-[0.3em] italic">
                {t('auth.login_desc')}
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-10 relative">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-[#001F3F] uppercase tracking-[0.2em] pl-6 block text-zinc-400">
                   {t('auth.email_label')}
                </label>
                <div className="relative group">
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center border-r-[1px] border-[#001F3F]/10 pr-4">
                    <Mail className="w-5 h-5 text-[#001F3F]/40 group-focus-within:text-[#E63E00] transition-colors" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@university.edu"
                    className="w-full bg-[#F8F9FA] border-[2px] border-zinc-100 rounded-[2.5rem] py-7 pl-20 pr-10 font-bold text-lg text-[#001F3F] focus:outline-none focus:border-[#001F3F] focus:bg-white transition-all shadow-inner placeholder:text-zinc-200"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-6">
                  <label className="text-[11px] font-black text-[#001F3F] uppercase tracking-[0.2em] text-zinc-400">
                    {t('auth.password_label')}
                  </label>
                  <Link href="#" className="text-[10px] font-black text-[#E63E00] uppercase hover:underline tracking-widest">{t('auth.lost_key')}</Link>
                </div>
                <div className="relative group">
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center border-r-[1px] border-[#001F3F]/10 pr-4">
                    <Lock className="w-5 h-5 text-[#001F3F]/40 group-focus-within:text-[#E63E00] transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#F8F9FA] border-[2px] border-zinc-100 rounded-[2.5rem] py-7 pl-20 pr-10 font-bold text-lg text-[#001F3F] focus:outline-none focus:border-[#001F3F] focus:bg-white transition-all shadow-inner placeholder:text-zinc-200"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#001F3F] text-white py-8 rounded-[3rem] font-black text-2xl uppercase tracking-[0.2em] hover:bg-[#E63E00] transition-all shadow-[0_30px_60px_-15px_rgba(0,31,63,0.3)] active:scale-95 flex items-center justify-center gap-6 group"
              >
                {loading ? t('auth.syncing') : t('auth.login_btn')} 
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </form>

            <div className="mt-20 pt-10 border-t border-zinc-100 flex flex-col items-center gap-6">
              <span className="text-[11px] font-black text-[#001F3F]/20 uppercase tracking-[0.4em]">{t('auth.new_user')}</span>
              <Link href="/register" className="group flex items-center gap-4">
                <span className="font-black text-sm text-[#001F3F] uppercase tracking-widest border-b-2 border-transparent group-hover:border-[#CCFF00] transition-all pb-1">
                  {t('auth.join_btn')}
                </span>
                <ArrowUpRight className="w-5 h-5 text-[#CCFF00] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          <p className="mt-12 text-center text-[10px] font-black text-zinc-300 uppercase tracking-[0.5em]">
            secure link via arc node 0.1 / YMCC 2026.4
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  );
}
