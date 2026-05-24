"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu, X, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SidebarLink {
  href: string;
  label: string;
  icon: any;
}

interface InternalSidebarProps {
  portalName: string;
  navLinks: SidebarLink[];
  children: React.ReactNode;
}

export function InternalSidebar({ portalName, navLinks, children }: InternalSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch user details for the top banner
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
         if (data && data.user && data.user.name) {
            setUserName(data.user.name);
         } else {
             setUserName("Panitia YMCC");
         }
      })
      .catch(() => setUserName("Panitia YMCC"));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-zinc-100 text-foreground font-sans selection:bg-accent selection:text-foreground">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#001F3F] text-white p-4 flex items-center justify-between border-b-4 border-foreground z-30 shadow-brutal-sm">
        <h2 className="font-heading text-xl md:text-2xl tracking-wide shadow-black drop-shadow-[2px_2px_0_#000]">
          YMCC VII
        </h2>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 border-2 border-transparent hover:border-[#CCFF00] text-white">
          <Menu className="w-7 h-7" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Neo Brutalist */}
      <aside 
        className={`fixed md:relative inset-y-0 left-0 w-72 bg-[#001F3F] border-r-4 border-foreground flex flex-col py-8 px-0 z-50 shadow-[6px_0_0_0_#000] md:shadow-none transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        
        <div className="mb-4 px-6 flex justify-between items-start">
          <div className="w-full text-center md:text-left">
            <h2 className="font-heading text-6xl text-white tracking-widest drop-shadow-[4px_4px_0_#CCFF00] mb-2 uppercase">
              YMCC
            </h2>
            <div className="inline-block px-3 py-1 bg-[#CCFF00] border-2 border-foreground text-foreground text-xs font-black uppercase tracking-widest shadow-[2px_2px_0_0_var(--color-foreground)] mb-6">
              {portalName}
            </div>
            
            {/* User Profile Banner */}
            <div className="bg-[#E63E00] border-2 border-foreground p-3 shadow-brutal-sm w-full relative mb-4 flex flex-col justify-center">
              <p className="text-white text-[10px] uppercase font-bold tracking-widest opacity-80">LOGIN SEBAGAI</p>
              <p className="font-bold text-white tracking-wide truncate mt-0.5">
                {userName ? userName : <Loader2 className="w-4 h-4 animate-spin text-white" />}
              </p>
            </div>
          </div>
          
          {/* Close button inside mobile sidebar */}
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute top-6 right-4 text-white hover:text-[#CCFF00] border-2 border-transparent hover:border-[#CCFF00] p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="w-full space-y-0 flex-1 px-4 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== pathname.split('/').slice(0, 3).join('/') && pathname.startsWith(link.href) && link.href !== '/admin' && link.href !== '/operator' && link.href !== '/fundraising' && link.href !== '/superadmin');
            return (
                <Link 
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-4 px-5 py-4 border-2 transition-all duration-200 group mb-3 shadow-[4px_4px_0_0_var(--color-foreground)] hover:-translate-y-1 hover:shadow-brutal-sm ${
                    isActive 
                      ? 'bg-[#CCFF00] border-foreground text-foreground font-black' 
                      : 'bg-white border-foreground text-zinc-600 hover:bg-[#CCFF00] hover:text-[#001F3F] font-bold'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-foreground' : 'text-zinc-600 group-hover:text-[#001F3F]'}`} />
                  <span className="text-sm tracking-widest uppercase">{link.label}</span>
                </Link>
            )
          })}

          <div className="my-6 border-t border-zinc-700/50 mx-4"></div>

          {/* Go Back To Public Site Button */}
          <Link 
            href="/"
            className="flex items-center justify-center space-x-3 px-4 py-4 mx-2 border-4 border-transparent hover:border-[#CCFF00] text-zinc-400 hover:text-[#CCFF00] transition-none group mb-2"
          >
             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             <span className="font-bold text-xs uppercase tracking-widest mt-0.5">Buka Website Publik</span>
          </Link>

        </nav>

          <div className="mx-4 p-4 bg-amber-100 border-4 border-foreground shadow-[4px_4px_0_0_#000] mb-6">
            <p className="font-black text-[10px] uppercase tracking-tighter text-zinc-500 mb-1">Butuh Bantuan?</p>
            <p className="text-xs font-bold leading-tight text-foreground uppercase">Mengalami kendala teknis atau bingung alur? Hubungi Command Center:</p>
            <a href="https://wa.me/something" className="mt-2 inline-flex items-center text-[10px] font-black bg-foreground text-white px-2 py-1 gap-1 hover:bg-accent hover:text-foreground transition-colors uppercase">
              Support Center 📡
            </a>
          </div>

          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start rounded-none border-2 border-transparent hover:border-red-500 bg-red-600 md:bg-transparent md:hover:bg-red-500 text-white md:text-red-400 hover:text-white font-bold tracking-widest uppercase transition-none h-12 relative overflow-hidden group">
            <span className="absolute inset-0 w-full h-full bg-red-500 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 -z-10" />
            <LogOut className="w-5 h-5 mr-3 group-hover:text-white transition-colors" />
            <span className="group-hover:text-white transition-colors text-sm">KELUAR (LOGOUT)</span>
          </Button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-50 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        
        <div className="w-full max-w-7xl mx-auto relative z-10 min-h-full p-6 md:p-10 lg:p-14">
          {children}
        </div>
      </main>
    </div>
  );
}
