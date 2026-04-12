'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Radio, LogOut, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { href: '/operator/control', label: 'MASTER CONTROL', icon: Radio },
    { href: '/operator/cms', label: 'CMS SYSTEM', icon: Terminal },
    { href: '/operator/cheat-monitor', label: 'CHEAT MONITOR', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex font-sans selection:bg-[#CCFF00] selection:text-[#001F3F]">
      <aside className="w-80 bg-[#001F3F] text-white border-r-8 border-[#E63E00] flex flex-col pt-12 z-20 shadow-[12px_0_0_0_#CCFF00]">
        
        <div className="mb-12 px-8">
          <h2 className="font-heading text-5xl font-black italic uppercase tracking-wide text-[#CCFF00]">OPERATOR.</h2>
          <span className="inline-flex mt-4 items-center font-bold text-xs uppercase bg-[#E63E00] text-white px-3 py-1 border-2 border-white shadow-brutal-sm">
            <Terminal className="w-4 h-4 mr-2" /> Master Control Panel
          </span>
        </div>

        <nav className="w-full flex-1 px-6 space-y-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href) && link.href !== '/operator';
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center px-4 py-5 border-4 transition-none group ${
                  isActive 
                    ? 'bg-[#CCFF00] border-white text-[#001F3F] font-black shadow-[4px_4px_0_0_#FFF]' 
                    : 'bg-transparent border-transparent text-zinc-300 font-bold hover:border-[#CCFF00] hover:text-[#CCFF00]'
                }`}
              >
                <link.icon className={`w-6 h-6 mr-4 ${isActive ? 'text-[#001F3F]' : 'text-zinc-500 group-hover:text-[#CCFF00]'}`} />
                <span className="text-lg tracking-widest">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="w-full mt-auto p-6 bg-[#001F3F] border-t-4 border-dashed border-zinc-600">
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start rounded-none border-4 border-transparent hover:border-[#E63E00] hover:bg-[#E63E00] hover:text-white text-[#E63E00] font-black tracking-widest uppercase transition-none h-14 text-lg">
            <LogOut className="w-6 h-6 mr-3" />
            DISCONNECT
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white relative p-10">
        <div className="absolute inset-0 bg-[#f5f5f5] bg-[radial-gradient(#001F3F_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
