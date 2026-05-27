'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import { X, Mail, Globe, MapPin, ShieldCheck, ArrowRight, Star } from 'lucide-react';

export function Footer() {
  const { t, lang } = useLanguage();
  const pathname = usePathname();

  const portalRoutes = ['/dashboard', '/admin', '/superadmin', '/operator', '/fundraising', '/exam'];
  const isPortal = portalRoutes.some(route => pathname.startsWith(route));

  if (isPortal) return null;

  return (
    <footer className="bg-white text-[#001F3F] pt-24 pb-12 border-t-[8px] border-[#001F3F] font-poppins relative z-10 overflow-hidden">
      
      {/* Background Graphic Accent */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] select-none pointer-events-none">
         <span className="font-black text-[15rem] leading-none tracking-tighter uppercase italic">YMCC</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Top Section: Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
           {/* Brand Card */}
           <div className="lg:col-span-1 bg-[#001F3F] text-white p-10 rounded-[3rem] shadow-[15px_15px_0_0_#CCFF00] flex flex-col justify-between group">
              <div>
                 <Link href="/" className="inline-flex items-center gap-4 mb-8">
                    <img src="/assets/ymcc logo kotak.png" className="w-10 h-10 object-contain" alt="YMCC" />
                    <span className="font-black text-3xl uppercase tracking-tighter">YMCC VII.</span>
                 </Link>
                 <p className="text-sm font-bold uppercase opacity-40 leading-relaxed italic pr-4">
                    Extending the boundaries of mineral extraction through digital leadership.
                 </p>
              </div>
              <div className="flex gap-4 mt-12">
                 <SocialIconDark href="#" icon={<X className="w-5 h-5" />} />
                 <SocialIconDark href="#" icon={<Mail className="w-5 h-5" />} />
                 <SocialIconDark href="#" icon={<Globe className="w-5 h-5" />} />
              </div>
           </div>

           {/* Newsletter/Action Card */}
           <div className="lg:col-span-2 bg-white border-[4px] border-[#001F3F] p-10 rounded-[3rem] shadow-[15px_15px_0_0_#E63E00] flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                 <div className="inline-flex items-center gap-2 bg-[#E63E00] text-white px-4 py-1.5 rounded-full mb-6">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Next Deployment</span>
                 </div>
                 <h4 className="font-black text-4xl uppercase tracking-tighter mb-4">READY TO JOIN <br/> THE NODE?</h4>
                 <p className="text-sm font-bold text-[#001F3F]/40 uppercase italic">Registration phase is now active for upcoming sectors.</p>
              </div>
              <Link href="/register" className="bg-[#001F3F] text-white px-10 py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#001F3F] transition-all flex items-center gap-4 group">
                 GET STARTED <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
           </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-3">
            <h4 className="font-black text-[10px] uppercase tracking-[0.4em] mb-10 text-[#001F3F]/20">{t('footer.nav')}</h4>
            <div className="flex flex-col gap-6">
              <FooterLink href="/about">{t('nav.about')}</FooterLink>
              <FooterLink href="/merch">{t('nav.store')}</FooterLink>
              <FooterLink href="/events">{t('nav.events')}</FooterLink>
              <FooterLink href="/news">{t('footer.news')}</FooterLink>
            </div>
          </div>

          <div className="lg:col-span-3">
             <h4 className="font-black text-[10px] uppercase tracking-[0.4em] mb-10 text-[#001F3F]/20">Official Media</h4>
             <div className="flex flex-col gap-6">
               <FooterLink href="/gallery">Site Gallery</FooterLink>
               <FooterLink href="/press">Press Kit</FooterLink>
               <FooterLink href="/archive">Archive Node</FooterLink>
               <FooterLink href="/identity">Brand Book</FooterLink>
             </div>
          </div>

          <div className="lg:col-span-6">
             <h4 className="font-black text-[10px] uppercase tracking-[0.4em] mb-10 text-[#001F3F]/20">Operational Node</h4>
             <div className="bg-zinc-50 border-[3px] border-zinc-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 group hover:border-[#001F3F] transition-all">
                <div className="w-20 h-20 bg-white border-2 border-zinc-100 rounded-3xl flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-xl transition-all">
                   <MapPin className="w-8 h-8 text-[#E63E00]" />
                </div>
                <div>
                   <h5 className="font-black text-xl uppercase tracking-tighter mb-2">UPN &quot;VETERAN&quot; YOGYAKARTA</h5>
                   <p className="text-[11px] font-bold text-[#001F3F]/40 uppercase italic leading-relaxed">
                     Fakultas Teknologi Mineral, Gedung Teknik Pertambangan. Tambak Bayan, Sleman, DIY.
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-12 border-t-[4px] border-zinc-100 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-6">
             <ShieldCheck className="w-6 h-6 text-[#001F3F]" />
             <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.4em]">
               {t('footer.copyright')}
             </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            <LegalLink href="/privacy">{t('footer.privacy')}</LegalLink>
            <LegalLink href="/terms">{t('footer.terms')}</LegalLink>
            <LegalLink href="/refund">{t('footer.refund')}</LegalLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-black text-[#001F3F] hover:text-[#E63E00] transition-colors uppercase italic flex items-center group">
      {children}
      <ArrowRight className="w-4 h-4 ml-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </Link>
  );
}

function LegalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-[#001F3F]/40 font-black text-[10px] uppercase tracking-[0.3em] hover:text-[#001F3F] transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[2px] after:bg-[#CCFF00] hover:after:w-full after:transition-all">
      {children}
    </Link>
  );
}

function SocialIconDark({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#CCFF00] hover:text-[#001F3F] hover:border-[#CCFF00] transition-all">
      {icon}
    </Link>
  );
}
