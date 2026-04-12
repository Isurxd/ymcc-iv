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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#001F3F] flex items-center justify-between px-4 md:px-6 py-3 border-b-4 border-white shadow-brutal-sm">
      
      {/* Mobile Hamburger Menu Toggle */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden p-1.5 border-2 border-transparent hover:border-[#CCFF00] text-white hover:text-[#CCFF00] mr-2 transition-colors"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <Link href="/" className="font-heading italic font-black text-xl md:text-2xl text-white mr-auto shrink-0">Y7 <span className="text-[#E63E00]">CORE</span></Link>
      
      {/* PUBLIC LINKS (Hidden on very small screens, visible as row on lg) */}
      <div className="hidden lg:flex flex-1 justify-center space-x-1 xl:space-x-3 font-bold text-[11px] xl:text-xs uppercase tracking-widest items-center truncate">
        <NavLink href="/" active={isActive('/')}>{lang === 'ID' ? 'Beranda' : 'Home'}</NavLink>
        <NavLink href="/about" active={isActive('/about')}>{lang === 'ID' ? 'Tentang' : 'About'}</NavLink>
        <NavLink href="/events" active={isActive('/events')}>Events</NavLink>
        <NavLink href="/news" active={isActive('/news')}>News</NavLink>
        <NavLink href="/videotron" active={isActive('/videotron')}>Media</NavLink>
        <NavLink href="/merch" active={isActive('/merch')} extraClass="drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]">Merch</NavLink>
        <NavLink href="/contact" active={isActive('/contact')}>{lang === 'ID' ? 'Kontak' : 'Contact'}</NavLink>
      </div>

      <div className="flex items-center space-x-3 md:space-x-4 shrink-0">
        
        {/* Gojek-style Language Dropdown */}
        <div 
          className="relative group"
          onMouseEnter={() => setIsLangOpen(true)}
          onMouseLeave={() => setIsLangOpen(false)}
        >
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest hover:text-[#CCFF00] flex gap-1.5 md:gap-2 items-center px-3 md:px-4 py-1.5 md:py-2 border-2 border-white/20 rounded-full hover:border-[#CCFF00] bg-white/5 backdrop-blur-sm transition-all duration-300"
          >
            <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="flex items-center gap-1">
              <span className="text-sm">
                {lang === 'ID' ? '🇮🇩' : '🇬🇧'}
              </span>
              <span>
                {lang === 'ID' ? 'ID' : 'EN'}
              </span>
            </span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`absolute right-0 mt-3 w-56 bg-zinc-900 border-2 border-[#CCFF00] shadow-[8px_8px_0_0_#E63E00] transition-all duration-200 z-50 overflow-hidden ${
            isLangOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
          }`}>
            <button 
              onClick={() => { setLang('ID'); setIsLangOpen(false); }} 
              className={`flex items-center w-full px-5 py-4 text-left hover:bg-[#CCFF00] hover:text-[#001F3F] transition-colors group/btn ${lang === 'ID' ? 'bg-[#CCFF00]/10 text-[#CCFF00] font-black' : 'text-zinc-300'}`}
            >
              <span className="text-xl mr-3">🇮🇩</span>
              <span className="uppercase tracking-wider text-sm mt-0.5">Bahasa Indonesia</span>
            </button>
            <div className="h-[2px] w-full bg-zinc-800" />
            <button 
              onClick={() => { setLang('EN'); setIsLangOpen(false); }} 
              className={`flex items-center w-full px-5 py-4 text-left hover:bg-[#CCFF00] hover:text-[#001F3F] transition-colors group/btn ${lang === 'EN' ? 'bg-[#CCFF00]/10 text-[#CCFF00] font-black' : 'text-zinc-300'}`}
            >
              <span className="text-xl mr-3">🇬🇧</span>
              <span className="uppercase tracking-wider text-sm mt-0.5">English</span>
            </button>
          </div>
        </div>
        
        {/* AUTH BLOCK */}
        {!user ? (
          <>
            <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-white hover:text-[#CCFF00] transition-colors whitespace-nowrap">
              {lang === 'ID' ? 'Masuk' : 'Log In'}
            </Link>
            <Link href="/register" className="px-4 py-2 bg-[#E63E00] border-2 border-white hover:bg-white hover:text-[#E63E00] hover:border-[#E63E00] text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-[2px_2px_0_0_rgba(255,255,255,1)] whitespace-nowrap">
              {lang === 'ID' ? 'Daftar' : 'Register'}
            </Link>
          </>
        ) : (
          <div className="flex items-center space-x-2">
             <Link href={getDashboardPath()} className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-[#CCFF00] text-[#001F3F] border-2 border-transparent hover:border-white font-bold uppercase tracking-widest text-xs transition-colors shadow-[2px_2px_0_0_#FFF]">
               <LayoutDashboard className="w-4 h-4 hidden sm:block" />
               <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
             </Link>
             <button 
               onClick={handleLogout} 
               className="p-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center bg-zinc-900" 
               title="Logout"
             >
               <LogOut className="w-4 h-4" />
             </button>
          </div>
        )}
      </div>

      {/* MOBILE PUBLIC LINKS DRAWER */}
      {isMobileMenuOpen && (
        <div className="absolute top-[60px] left-0 right-0 bg-[#001F3F] border-b-4 border-white shadow-brutal-lg lg:hidden flex flex-col p-4 space-y-2 z-40 max-h-[80vh] overflow-y-auto">
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className="px-4 py-3 bg-zinc-900 border-2 border-transparent hover:border-[#CCFF00] text-white hover:text-[#CCFF00] font-bold uppercase tracking-widest text-sm transition-colors text-center">{lang === 'ID' ? 'Beranda' : 'Home'}</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/about" className="px-4 py-3 bg-zinc-900 border-2 border-transparent hover:border-[#CCFF00] text-white hover:text-[#CCFF00] font-bold uppercase tracking-widest text-sm transition-colors text-center">{lang === 'ID' ? 'Tentang' : 'About'}</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/events" className="px-4 py-3 bg-zinc-900 border-2 border-transparent hover:border-[#CCFF00] text-white hover:text-[#CCFF00] font-bold uppercase tracking-widest text-sm transition-colors text-center">Events</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/news" className="px-4 py-3 bg-zinc-900 border-2 border-transparent hover:border-[#CCFF00] text-white hover:text-[#CCFF00] font-bold uppercase tracking-widest text-sm transition-colors text-center">News</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/videotron" className="px-4 py-3 bg-zinc-900 border-2 border-transparent hover:border-[#CCFF00] text-white hover:text-[#CCFF00] font-bold uppercase tracking-widest text-sm transition-colors text-center">Media</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/merch" className="px-4 py-3 bg-[#CCFF00] text-[#001F3F] font-bold uppercase tracking-widest text-sm shadow-[4px_4px_0_0_#E63E00] border-2 border-transparent text-center my-2">Official Merch</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/contact" className="px-4 py-3 bg-zinc-900 border-2 border-transparent hover:border-[#CCFF00] text-white hover:text-[#CCFF00] font-bold uppercase tracking-widest text-sm transition-colors text-center">{lang === 'ID' ? 'Kontak' : 'Contact'}</Link>
        </div>
      )}
    </nav>
  );
}
