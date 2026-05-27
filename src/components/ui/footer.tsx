'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import { 
  X, 
  Mail, 
  LayoutDashboard, 
  Trophy, 
  Download, 
  Store, 
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const { t, lang } = useLanguage();
  const pathname = usePathname();

  const portalRoutes = ['/dashboard', '/admin', '/superadmin', '/operator', '/fundraising', '/exam'];
  const isPortal = portalRoutes.some(route => pathname.startsWith(route));

  // If in portal, don't show the traditional footer (Grass.io style)
  if (isPortal) return null;

  const mobileNavItems = [
    { name: 'Home', icon: <LayoutDashboard size={24} />, path: '/' },
    { name: 'Rewards', icon: <Trophy size={24} />, path: '/rewards' },
    { name: 'Download', icon: <Download size={24} />, path: '/download' },
    { name: 'Store', icon: <Store size={24} />, path: '/merch' },
    { name: 'Profile', icon: <User size={24} />, path: '/profile' },
  ];

  return (
    <>
      <footer className="bg-white border-t border-zinc-100 py-16 px-6 md:px-12 font-poppins relative z-20 pb-32 md:pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8">
                <img src="/assets/ymcc logo kotak.png" alt="YMCC" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-2xl tracking-tighter text-black">ymcc</span>
              <span className="text-[10px] self-start mt-1 font-medium text-zinc-400 uppercase">tm</span>
            </Link>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-xs">
              Membangun masa depan industri mineral melalui kepemimpinan digital dan inovasi berkelanjutan.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={<X size={18} />} />
              <SocialLink href="#" icon={<Mail size={18} />} />
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#CCFF00] bg-black px-3 py-1 inline-block rounded-lg mb-8">Navigation</h4>
            <div className="space-y-4">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/events">Selection Pipeline</FooterLink>
              <FooterLink href="/merch">Official Store</FooterLink>
              <FooterLink href="/news">Announcements</FooterLink>
            </div>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-black mb-8 pl-1">Legal Protocols</h4>
            <div className="space-y-4">
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/refund">Refund Policy</FooterLink>
              <FooterLink href="/cookies">Cookie Settings</FooterLink>
            </div>
          </div>

          {/* Newsletter / Status Component */}
          <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Trophy size={80} />
            </div>
            <div className="relative z-10">
               <h5 className="font-bold text-sm uppercase tracking-tight mb-2">System Status</h5>
               <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Nodes Operational</span>
               </div>
               <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-[#CCFF00] transition-colors">
                  View help center <ExternalLink size={14} />
               </button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-300 text-[10px] font-bold uppercase tracking-widest">
            © 2026 YMCC VII NODE SYSTEM. ALL ACCESS PROTECTED.
          </p>
          <div className="flex items-center gap-2 text-zinc-300">
             <span className="w-2 h-2 rounded-full bg-zinc-200" />
             <span className="text-[10px] font-bold uppercase tracking-widest">v2026.4.12-Alpha</span>
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION (Cloned from Grass Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 h-20 z-[100] lg:hidden px-4 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        {mobileNavItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.path}
            className={`flex flex-col items-center justify-center gap-1.5 flex-1 h-full relative ${
              pathname === item.path ? 'text-black' : 'text-zinc-300 hover:text-zinc-500'
            }`}
          >
            <div className={`p-2 rounded-xl transition-all ${
              pathname === item.path ? 'bg-[#CCFF00] border border-black shadow-[2px_2px_0px_0px_#000]' : ''
            }`}>
              {item.icon}
            </div>
            {pathname === item.path && (
              <motion.div layoutId="bottomNav" className="absolute -top-1 w-6 h-1 bg-black rounded-full" />
            )}
          </Link>
        ))}
      </nav>
    </>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-xs font-bold text-zinc-500 hover:text-black uppercase tracking-tight flex items-center group transition-all">
      {children}
      <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </Link>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-black hover:text-[#CCFF00] hover:border-black transition-all">
      {icon}
    </Link>
  );
}
