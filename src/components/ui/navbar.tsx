'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import { LogOut, Menu, X, ChevronRight, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Daftar prefix rute portal yang tidak boleh menampilkan Navbar publik
  const portalRoutes = ['/dashboard', '/admin', '/superadmin', '/operator', '/fundraising', '/exam'];
  const isPortal = portalRoutes.some(route => pathname.startsWith(route));

  // Deteksi halaman interior untuk visibilitas
  const isInterior = pathname !== '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    return '/dashboard';
  };

  const isActive = (path: string) => pathname === path;

  // Jika di portal, jangan render apapun
  if (isPortal) return null;

  // State solid jika di-scroll ATAU di halaman interior
  const isSolid = isScrolled || isInterior;

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-[99999] flex justify-center items-center pointer-events-none"
        style={{ height: '110px' }}
      >
        <div 
          className={`flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-auto ${
            isSolid 
              ? 'mt-4 w-[95%] max-w-7xl bg-white/95 backdrop-blur-3xl border border-zinc-200 rounded-full h-16 md:h-20 px-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)]' 
              : 'mt-0 w-full bg-transparent h-28 px-12 md:px-24'
          }`}
        >
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-4 group shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-transform group-hover:scale-110">
              <img 
                src="/assets/ymcc logo kotak.png" 
                alt="YMCC Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className={`font-black text-2xl tracking-tighter lowercase leading-none transition-colors duration-500 ${isSolid ? 'text-[#001F3F]' : 'text-white'}`}>ymcc</span>
              <span className="text-[10px] font-black text-[#E63E00] uppercase tracking-[0.25em]">competition</span>
            </div>
          </Link>
          
          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-12">
            {['home', 'about', 'events', 'store'].map((item) => {
              const path = item === 'home' ? '/' : `/${item === 'store' ? 'merch' : item}`;
              return (
                <Link 
                  key={item}
                  href={path} 
                  className={`font-black text-[11px] tracking-[0.15em] uppercase hover:text-[#E63E00] transition-all relative group/link ${
                    isActive(path) 
                      ? (isSolid ? 'text-[#001F3F]' : 'text-[#CCFF00]') 
                      : (isSolid ? 'text-[#001F3F]/30' : 'text-white/60')
                  }`}
                >
                  {t(`nav.${item}`)}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#E63E00] transition-all duration-300 ${isActive(path) ? 'w-full' : 'w-0 group-hover/link:w-full'}`} />
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setLang(lang === 'ID' ? 'EN' : 'ID')}
              className={`hidden sm:flex items-center gap-2 font-black text-[11px] tracking-widest transition-all ${isSolid ? 'text-[#001F3F]/20 hover:text-[#001F3F]' : 'text-white/30 hover:text-white'}`}
            >
              <Globe className="w-4 h-4" />
              {lang}
            </button>

            {!user ? (
              <Link 
                href="/login" 
                className={`rounded-full font-black text-[10px] md:text-[11px] tracking-[0.1em] uppercase transition-all flex items-center justify-center min-w-[150px] md:min-w-[190px] h-11 md:h-12 border-2 group/btn relative overflow-hidden ${
                  isSolid 
                    ? 'bg-black text-white border-black hover:bg-[#E63E00] hover:border-[#E63E00]' 
                    : 'bg-white text-[#001F3F] border-white hover:bg-transparent hover:text-white'
                }`}
              >
                 <span className="relative z-10 flex items-center gap-2">
                   {t('nav.open_dashboard')} <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                 </span>
              </Link>
            ) : (
              <div className="flex items-center gap-5">
                <Link href={getDashboardPath()} className={`px-6 md:px-8 py-3 rounded-full font-black text-[11px] tracking-[0.1em] uppercase transition-all shadow-lg ${isSolid ? 'bg-[#001F3F] text-white hover:bg-black' : 'bg-white text-[#001F3F] hover:bg-[#CCFF00]'}`}>
                  {user.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="text-[#E63E00] hover:scale-125 transition-transform">
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            )}

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`lg:hidden p-2 rounded-full transition-colors ${isSolid ? 'text-[#001F3F] bg-zinc-100' : 'text-white bg-white/10'}`}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Overlay Menu */}
          <AnimatePresence>
              {isMobileMenuOpen && (
              <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  className="absolute top-24 left-4 right-4 bg-white/95 backdrop-blur-2xl border border-zinc-200 p-10 flex flex-col gap-8 lg:hidden shadow-2xl rounded-[3rem]"
              >
                  {['home', 'about', 'events', 'store'].map((item) => (
                      <Link 
                          key={item}
                          onClick={() => setIsMobileMenuOpen(false)} 
                          href={item === 'home' ? '/' : `/${item === 'store' ? 'merch' : item}`} 
                          className="font-black text-2xl uppercase tracking-widest text-[#001F3F] flex justify-between items-center"
                      >
                          {t(`nav.${item}`)}
                          <ChevronRight className="w-6 h-6 text-[#E63E00]" />
                      </Link>
                  ))}
              </motion.div>
              )}
          </AnimatePresence>
        </div>
      </header>
      
      {/* Spacer agar konten tidak tertutup navbar fixed saat di halaman interior */}
      {isInterior && <div className="h-28 hidden lg:block" />}
      {isInterior && <div className="h-24 lg:hidden" />}
    </>
  );
}
