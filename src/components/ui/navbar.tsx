'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import { 
  Search, 
  ShoppingBag, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  LayoutDashboard,
  Trophy,
  Download,
  Store,
  User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // List of portal prefixes that shouldn't show public Navbar
  const portalRoutes = ['/dashboard', '/admin', '/superadmin', '/operator', '/fundraising', '/exam'];
  const isPortal = portalRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if(res.ok) return res.json();
        throw new Error('Not logged in');
      })
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => setUser(null));
  }, [pathname]);

  if (isPortal) return null;

  const navItems = [
    { name: 'Live Status', icon: <Activity size={18} />, path: '/status', badge: 'Live' },
    { name: 'Rewards', icon: <Trophy size={18} />, path: '/rewards' },
    { name: 'Store', icon: <Store size={18} />, path: '/merch' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-zinc-100 h-[72px] px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-8">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 hover:bg-zinc-50 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="/assets/ymcc logo kotak.png" alt="YMCC" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-2xl tracking-tighter text-black">ymcc</span>
          <span className="text-[10px] self-start mt-1 font-medium text-zinc-400 uppercase">tm</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all relative ${
                pathname === item.path 
                  ? 'bg-[#CCFF00] text-black border-[1.5px] border-black shadow-[2px_2px_0px_0px_#000]' 
                  : 'text-zinc-500 hover:text-black hover:bg-zinc-50'
              }`}
            >
              {item.icon}
              {item.name}
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-zinc-200 text-[9px] px-1.5 py-0.5 rounded-full text-zinc-600 font-bold border border-white">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1 md:gap-4">
        <div className="flex items-center gap-1 mr-2 md:mr-4">
           <button className="p-2.5 text-zinc-500 hover:text-black hover:bg-zinc-50 rounded-full transition-all">
             <Search size={20} />
           </button>
           <Link href="/merch/cart" className="p-2.5 text-zinc-500 hover:text-black hover:bg-zinc-50 rounded-full transition-all relative">
             <ShoppingBag size={20} />
             <span className="absolute top-2 right-2 w-2 h-2 bg-[#CCFF00] border-2 border-white rounded-full" />
           </Link>
        </div>

        <div className="h-6 w-[1px] bg-zinc-100 hidden sm:block" />

        <div className="flex items-center gap-1 sm:ml-2">
           <button 
             onClick={() => setIsDarkMode(!isDarkMode)}
             className="p-2.5 text-zinc-500 hover:text-black hover:bg-zinc-50 rounded-xl transition-all border border-transparent hover:border-zinc-200"
           >
             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
           </button>
           
           {user ? (
             <Link href="/dashboard" className="flex items-center gap-3 bg-black text-[#CCFF00] px-4 py-2 rounded-xl font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all ml-2">
               Portal Dashboard
             </Link>
           ) : (
             <Link href="/login" className="flex items-center gap-3 bg-[#CCFF00] text-black px-4 py-2 rounded-xl font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all ml-2">
               Sign In
             </Link>
           )}
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed inset-0 top-[72px] bg-white z-[100] lg:hidden p-6 flex flex-col gap-4"
          >
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 p-4 rounded-3xl font-bold text-lg transition-all ${
                  pathname === item.path 
                    ? 'bg-[#CCFF00] border-2 border-black shadow-[4px_4px_0px_0px_#000]' 
                    : 'bg-zinc-50 text-zinc-600'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
