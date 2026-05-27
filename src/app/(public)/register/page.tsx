'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Mail, Lock, Info, ExternalLink } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center p-6 md:p-12">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white border-2 border-black rounded-[3.5rem] p-8 md:p-16 shadow-[8px_8px_0px_0px_#000] relative overflow-hidden"
      >
        {/* Branding Node */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8">
              <img src="/assets/ymcc logo kotak.png" alt="YMCC" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-2xl tracking-tighter text-black">ymcc</span>
          </Link>
          <span className="bg-zinc-100 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-500 border border-zinc-200">Auth Node</span>
        </div>

        <div className="mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tight italic mb-4">{t('auth.register_title')}</h2>
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-tight">Create your official YMCC participant account.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-black uppercase tracking-widest pl-2">{t('auth.first_name')}</label>
              <input id="firstName" value={formData.firstName} onChange={handleChange} required placeholder="JOHN" className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:border-black focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-black uppercase tracking-widest pl-2">{t('auth.last_name')}</label>
              <input id="lastName" value={formData.lastName} onChange={handleChange} required placeholder="DOE" className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:border-black focus:bg-white transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-black uppercase tracking-widest pl-2">{t('auth.email_label')}</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
              <input id="email" type="email" value={formData.email} onChange={handleChange} required placeholder="team@university.edu" className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-sm focus:outline-none focus:border-black focus:bg-white transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-black uppercase tracking-widest pl-2">{t('auth.password_label')}</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                <input id="password" type="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-sm focus:outline-none focus:border-black focus:bg-white transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-black uppercase tracking-widest pl-2">{t('auth.confirm_password')}</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                <input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required placeholder="••••••••" className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-sm focus:outline-none focus:border-black focus:bg-white transition-all" />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 translate-y-4">
             <div className="relative shrink-0">
                <input type="checkbox" required className="peer w-6 h-6 bg-white border-2 border-zinc-200 rounded-lg appearance-none checked:bg-[#CCFF00] checked:border-black transition-all cursor-pointer" />
                <div className="absolute top-1 left-1 text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                   <Check className="w-4 h-4 stroke-[4px]" />
                </div>
             </div>
             <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight leading-relaxed">
                I agree to the YMCC Node protocols and terms of service.
             </p>
          </div>

          <div className="pt-8">
             <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-[#CCFF00] text-black py-5 rounded-full font-black text-base uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-4"
             >
                {loading ? t('auth.processing') : t('auth.register_btn')} 
                {!loading && <ArrowRight className="w-5 h-5" />}
             </button>
          </div>
        </form>

        <div className="mt-12 pt-8 border-t border-zinc-50 flex flex-col items-center gap-6">
           <p className="text-xs font-bold text-zinc-400 uppercase tracking-tight">
              {t('auth.already_user')} 
              <Link href="/login" className="text-black ml-2 hover:underline">
                {t('nav.login')}
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
