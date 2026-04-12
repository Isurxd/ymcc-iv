'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Database, ShieldAlert, LogOut, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SuperAdminLayout({
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
    { href: '/superadmin', label: 'SYSTEM METRICS', icon: Activity },
    { href: '/superadmin/users', label: 'ACCESS CONTROL', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen flex font-sans selection:bg-red-500 selection:text-white">
      <aside className="w-80 bg-black text-white border-r-8 border-red-600 flex flex-col pt-12 z-20 shadow-[12px_0_0_0_rgba(255,0,0,0.3)]">
        
        <div className="mb-12 px-8">
          <h2 className="font-heading text-5xl font-black italic uppercase tracking-wide text-white drop-shadow-[4px_4px_0_red]">ROOT.</h2>
          <span className="inline-flex mt-4 items-center font-bold text-xs uppercase bg-red-600 text-white px-3 py-1 shadow-brutal-sm border-2 border-white">
            <Database className="w-4 h-4 mr-2" /> SUPERVISOR NODE
          </span>
        </div>

        <nav className="w-full flex-1 px-6 space-y-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/superadmin');
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center px-4 py-5 border-4 transition-none group ${
                  isActive 
                    ? 'bg-red-600 border-white text-white font-black shadow-[4px_4px_0_0_#FFF]' 
                    : 'bg-transparent border-transparent text-zinc-400 font-bold hover:border-red-600 hover:text-red-500'
                }`}
              >
                <link.icon className={`w-6 h-6 mr-4 ${isActive ? 'text-white' : 'text-zinc-600 group-hover:text-red-500'}`} />
                <span className="text-lg tracking-widest">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="w-full mt-auto p-6 bg-black border-t-4 border-dashed border-zinc-800">
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start rounded-none border-4 border-transparent hover:border-zinc-500 hover:bg-zinc-800 hover:text-white text-zinc-500 font-black tracking-widest uppercase transition-none h-14 text-lg">
            <LogOut className="w-6 h-6 mr-3" />
            HALT
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white relative p-10">
        <div className="absolute inset-0 bg-red-50 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
