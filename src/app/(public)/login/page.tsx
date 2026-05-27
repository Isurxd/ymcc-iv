'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Info, ExternalLink } from 'lucide-react';
import AppSwal from '@/lib/swal';
import { useLanguage } from '@/lib/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
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
    <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center p-6 md:p-12">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-white border-2 border-black rounded-[3.5rem] p-8 md:p-16 shadow-[8px_8px_0px_0px_#000] relative overflow-hidden"
      >
        {/* Branding Node */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8">
              <img src="/assets/ymcc logo kotak.png" alt="YMCC" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-2xl tracking-tighter text-black">ymcc</span>
          </Link>
          <span className="bg-zinc-100 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-500 border border-zinc-200">Access Node</span>
        </div>

        <div className="mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tight italic mb-4">{t('auth.login_title')}</h2>
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-tight">Access your centralized selection dashboard.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-black uppercase tracking-widest pl-2">{t('auth.email_label')}</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="team@university.edu" 
                className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-5 pl-14 pr-6 font-bold text-sm focus:outline-none focus:border-black focus:bg-white transition-all underline-offset-4" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black text-black uppercase tracking-widest">{t('auth.password_label')}</label>
              <button type="button" className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">Forgot Key?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••" 
                className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-5 pl-14 pr-6 font-bold text-sm focus:outline-none focus:border-black focus:bg-white transition-all" 
              />
            </div>
          </div>

          <div className="pt-6">
             <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-[#CCFF00] text-black py-5 rounded-full font-black text-base uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-4"
             >
                {loading ? t('auth.syncing') : t('auth.login_btn')} 
                {!loading && <ArrowRight className="w-5 h-5" />}
             </button>
          </div>
        </form>

        <div className="mt-12 pt-8 border-t border-zinc-50 flex flex-col items-center gap-6">
           <p className="text-xs font-bold text-zinc-400 uppercase tracking-tight">
              {t('auth.new_user')} 
              <Link href="/register" className="text-black ml-2 hover:underline">
                {t('auth.join_btn')}
              </Link>
           </p>
           
           <div className="flex gap-6">
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:text-black transition-all">
                 <Info size={14} /> Help Center
              </button>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:text-black transition-all">
                 <ExternalLink size={14} /> System Status
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
