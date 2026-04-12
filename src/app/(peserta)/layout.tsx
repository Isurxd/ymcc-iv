'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Upload, LogOut, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PesertaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { href: '/dashboard', label: 'THE OVERVIEW', icon: Home },
    { href: '/dashboard/registration', label: 'REQUIREMENTS', icon: Upload },
    { href: '/dashboard/exam', label: 'E-CBT SYSTEM', icon: Search },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-zinc-100 text-foreground font-sans selection:bg-accent selection:text-foreground">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-blue-950 text-white p-4 flex items-center justify-between border-b-4 border-foreground z-30 shadow-brutal-sm">
        <h2 className="font-heading text-2xl tracking-wide shadow-black drop-shadow-[2px_2px_0_#001F3F] [-webkit-text-stroke:1px_#001F3F]">
          YMCC VII
        </h2>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 border-2 border-transparent hover:border-accent text-white">
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
        className={`fixed md:relative inset-y-0 left-0 w-72 bg-blue-950 border-r-4 border-foreground flex flex-col py-8 px-0 z-50 shadow-brutal-lg transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        
        <div className="mb-10 px-6 flex justify-between items-start">
          <div>
            <h2 className="font-heading text-5xl text-white tracking-wide shadow-black drop-shadow-[4px_4px_0_#001F3F] [-webkit-text-stroke:1px_#001F3F]">
              YMCC VII
            </h2>
            <div className="inline-block mt-3 px-2 py-1 bg-accent border-2 border-foreground text-foreground text-xs font-bold uppercase shadow-[2px_2px_0_0_var(--color-foreground)]">
              Participant Portal
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white hover:text-accent border-2 border-transparent hover:border-accent p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="w-full space-y-0 flex-1 px-4">
          {navLinks.map((link, i) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <div key={link.href}>
                <Link 
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-4 border-4 transition-none group mb-2 ${
                    isActive 
                      ? 'bg-accent border-foreground text-foreground shadow-brutal-sm' 
                      : 'bg-transparent border-transparent text-zinc-300 hover:border-accent hover:text-accent hover:bg-zinc-900/50'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-foreground' : 'text-zinc-400 group-hover:text-accent'} ${isActive ? 'fill-foreground/20' : ''}`} />
                  <span className={`font-heading text-xl italic tracking-wider ${isActive ? 'font-bold' : ''}`}>{link.label}</span>
                </Link>
              </div>
            )
          })}
        </nav>

        <div className="w-full mt-auto px-4 pt-6">
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start rounded-none border-4 border-transparent hover:border-red-500 hover:bg-red-500 hover:text-white text-red-400 font-bold tracking-widest uppercase transition-none h-12 relative overflow-hidden group">
            <span className="absolute inset-0 w-full h-full bg-red-500 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 -z-10" />
            <LogOut className="w-5 h-5 mr-3 group-hover:text-white transition-colors" />
            <span className="group-hover:text-white transition-colors">TERPUTUS (LOGOUT)</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white relative">
        {/* Background grids styling */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto p-8 lg:p-12 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
