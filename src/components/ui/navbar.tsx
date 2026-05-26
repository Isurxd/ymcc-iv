'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import { Globe, ChevronDown, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Navbar() {
  const { lang, setLang } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if(res.ok) return res.json();
        throw new Error('Not logged in');
      })
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch((_) => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'SUPERADMIN') return '/superadmin';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'OPERATOR') return '/operator';
    if (user.role === 'FUNDRAISING') return '/fundraising';
    return '/dashboard'; // Peserta format
  };

  const isActive = (path: string) => pathname === path;

  // Shrink padding agar muat lebih banyak form menu di md-lg screens
  const NavLink = ({ href, children, active, extraClass = '' }: { href: string, children: React.ReactNode, active: boolean, extraClass?: string }) => (
    <Link 
      href={href} 
      className={`px-3 py-2 border-2 transition-all duration-300 ${active ? 'border-[#CCFF00] bg-[#CCFF00] text-[#001F3F] shadow-[3px_3px_0_0_#E63E00] -translate-y-0.5' : 'border-transparent text-zinc-300 hover:text-white hover:border-white/20'} ${extraClass}`}
    >
      {children}
    </Link>
  );

  return (
  return (
    <div className="fixed top-6 left-0 right-0 z-[100] px-4 md:px-0">
      <nav className="max-w-6xl mx-auto bg-white/70 backdrop-blur-md border-2 border-[#001F3F]/10 px-4 md:px-8 py-3 rounded-full flex items-center justify-between shadow-[0_12px_40px_rgba(0,31,63,0.1)]">
        
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#001F3F] rounded-full flex items-center justify-center border-2 border-[#CCFF00] shadow-[2px_2px_0_0_#001F3F] group-hover:rotate-12 transition-transform">
             <span className="text-[10px] font-black text-white italic">Y7</span>
          </div>
          <span className="font-black text-xl text-[#001F3F] hidden sm:block tracking-tighter italic">CORE</span>
        </Link>
        
        {/* PUBLIC LINKS */}
        <div className="hidden lg:flex items-center space-x-1 font-black text-[10px] uppercase tracking-[0.2em] text-[#001F3F]/60">
          <Link href="/" className={`px-4 py-2 hover:text-[#001F3F] transition-colors ${isActive('/') ? 'text-[#001F3F]' : ''}`}>{lang === 'ID' ? 'HOME' : 'HOME'}</Link>
          <Link href="/about" className={`px-4 py-2 hover:text-[#001F3F] transition-colors ${isActive('/about') ? 'text-[#001F3F]' : ''}`}>{lang === 'ID' ? 'ABOUT' : 'ABOUT'}</Link>
          <Link href="/events" className={`px-4 py-2 hover:text-[#001F3F] transition-colors ${isActive('/events') ? 'text-[#001F3F]' : ''}`}>EVENTS</Link>
          <Link href="/news" className={`px-4 py-2 hover:text-[#001F3F] transition-colors ${isActive('/news') ? 'text-[#001F3F]' : ''}`}>NEWS</Link>
          <Link href="/merch" className={`px-4 py-2 hover:text-[#E63E00] transition-colors ${isActive('/merch') ? 'text-[#E63E00]' : ''}`}>STORE</Link>
        </div>

        <div className="flex items-center space-x-3 md:space-x-4">
          
          {/* Language Toggle */}
          <button 
            onClick={() => setLang(lang === 'ID' ? 'EN' : 'ID')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-[#001F3F]/10 hover:border-[#001F3F] transition-all bg-white shadow-sm"
          >
             <span className="text-xs font-black text-[#001F3F]">{lang}</span>
             <Globe className="w-3.5 h-3.5 text-[#001F3F]" />
          </button>
          
          {/* AUTH BLOCK */}
          {!user ? (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-5 py-2 font-black text-[10px] text-[#001F3F] uppercase tracking-widest hover:text-[#E63E00] transition-colors">
                {lang === 'ID' ? 'Log In' : 'Log In'}
              </Link>
              <Link href="/register" className="bg-[#CCFF00] border-2 border-[#001F3F] px-6 py-2.5 rounded-full font-black text-[10px] text-[#001F3F] uppercase tracking-widest shadow-[4px_4px_0_0_#001F3F] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                {lang === 'ID' ? 'GET STARTED' : 'GET STARTED'}
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
               <Link href={getDashboardPath()} className="flex items-center gap-2 px-5 py-2.5 bg-[#001F3F] text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-[4px_4px_0_0_#CCFF00] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                 <LayoutDashboard className="w-3.5 h-3.5" />
                 <span>{user.name.split(' ')[0]}</span>
               </Link>
               <button 
                 onClick={handleLogout} 
                 className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#001F3F]/10 text-red-500 hover:bg-red-50 transition-colors"
                 title="Logout"
               >
                 <LogOut className="w-4 h-4" />
               </button>
            </div>
          )}

          {/* Mobile Menu */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#001F3F]"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Pill Style) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 bg-white border-2 border-[#001F3F] rounded-3xl p-6 shadow-2xl flex flex-col gap-4 lg:hidden"
          >
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className="font-black text-sm uppercase tracking-widest text-[#001F3F] py-2 border-b-2 border-zinc-50">Home</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/about" className="font-black text-sm uppercase tracking-widest text-[#001F3F] py-2 border-b-2 border-zinc-50">About</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/events" className="font-black text-sm uppercase tracking-widest text-[#001F3F] py-2 border-b-2 border-zinc-50">Events</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/merch" className="font-black text-sm uppercase tracking-widest text-[#E63E00] py-2">Official Store</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
