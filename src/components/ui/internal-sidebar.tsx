"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu, X, ArrowLeft, Loader2, ShieldCheck, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F4F5] text-black font-poppins selection:bg-[#CCFF00] selection:text-black">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white text-black p-4 flex items-center justify-between border-b-2 border-black z-30 shadow-[2px_2px_0_0_#000]">
        <div className="flex items-center gap-2">
           <img src="/assets/ymcc logo kotak.png" alt="YMCC" className="w-8 h-8 object-contain" />
           <h2 className="font-black text-xl tracking-tighter uppercase italic">YMCC VII</h2>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 border-2 border-black rounded-xl bg-[#CCFF00] shadow-[2px_2px_0_0_#000]">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Executive Command Style */}
      <aside 
        className={`fixed md:sticky md:top-0 inset-y-0 left-0 w-80 bg-white border-r-2 border-black flex flex-col py-8 px-6 z-50 transition-transform duration-300 ease-in-out md:h-screen ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        
        {/* Branding Node */}
        <div className="mb-10 flex flex-col items-center md:items-start">
          <div className="flex items-center gap-3 mb-6 group cursor-pointer" onClick={() => router.push('/')}>
             <div className="w-12 h-12 bg-[#CCFF00] border-2 border-black rounded-2xl flex items-center justify-center shadow-[3px_3px_0_0_#000] group-hover:bg-black group-hover:text-[#CCFF00] transition-all">
                <ShieldCheck size={28} />
             </div>
             <div>
                <h2 className="font-black text-3xl text-black tracking-tighter uppercase italic leading-none">YMCC.</h2>
                <div className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mt-1">Global Command</div>
             </div>
          </div>
          
          <div className="w-full bg-zinc-50 border-2 border-black p-4 rounded-3xl shadow-[3px_3px_0_0_#000] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                <Zap size={60} />
             </div>
             <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-black bg-[#CCFF00] flex items-center justify-center font-black italic">
                   {userName ? userName[0].toUpperCase() : 'P'}
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none">Active Auth:</p>
                   <p className="font-black text-xs text-black truncate mt-1 uppercase italic tracking-tighter">
                      {userName || 'System Node'}
                   </p>
                </div>
             </div>
          </div>
          
          {/* Close button inside mobile sidebar */}
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute top-8 right-6 w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center bg-white shadow-[2px_2px_0_0_#000]">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Core */}
        <nav className="w-full space-y-3 flex-1 overflow-y-auto pr-2 no-scrollbar mb-8">
          <div className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.4em] mb-4 pl-4">System Access</div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== pathname.split('/').slice(0, 3).join('/') && pathname.startsWith(link.href) && link.href !== '/admin' && link.href !== '/operator' && link.href !== '/fundraising' && link.href !== '/superadmin');
            return (
                <Link 
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-3xl border-2 transition-all duration-300 group shadow-[4px_4px_0_0_transparent] hover:translate-x-1 ${
                    isActive 
                      ? 'bg-[#CCFF00] border-black text-black shadow-[4px_4px_0_0_#000]' 
                      : 'bg-white border-transparent text-zinc-400 hover:bg-zinc-50 hover:border-zinc-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-zinc-400 group-hover:text-black'}`} />
                  <span className={`text-[11px] font-black tracking-widest uppercase italic ${isActive ? 'text-black' : 'text-zinc-400 group-hover:text-black'}`}>{link.label}</span>
                </Link>
            )
          })}

          <div className="my-8 h-[1px] bg-zinc-100 mx-4" />
          
          <Link 
            href="/"
            className="flex items-center gap-4 px-6 py-4 rounded-3xl text-zinc-300 hover:text-black hover:bg-zinc-50 transition-all group"
          >
             <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
             <span className="font-black text-[10px] uppercase tracking-widest">Public Website</span>
          </Link>
        </nav>

        {/* Support & Logout Node */}
        <div className="mt-auto space-y-4 pt-6 border-t border-zinc-50">
           <div className="bg-[#EBF7D3] border-2 border-black p-5 rounded-[2.5rem] shadow-[4px_4px_0_0_#000]">
              <div className="flex items-center gap-3 mb-2">
                 <Activity size={14} className="text-green-600" />
                 <span className="text-[9px] font-black uppercase text-green-700 tracking-widest italic">Core Stability: 100%</span>
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase leading-tight italic">
                 Need assistance? Open a direct uplink to HQ.
              </p>
           </div>
           
           <button 
             onClick={handleLogout}
             className="w-full bg-black text-[#CCFF00] py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-3 active:scale-95"
           >
             <LogOut size={16} /> Disconnect Node
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden relative bg-[#F4F4F5]">
        <div className="absolute top-0 right-0 w-full h-[600px] bg-[radial-gradient(ellipse_at_top_right,rgba(204,255,0,0.05),transparent_50%)] pointer-events-none" />
        
        <div className="w-full max-w-[1400px] mx-auto relative z-10 min-h-screen p-6 md:p-10 lg:p-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
