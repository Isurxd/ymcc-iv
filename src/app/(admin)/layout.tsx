'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, CreditCard, FileCheck2, LogOut, QrCode, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
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
    { href: '/admin', label: 'STATISTIK', icon: LayoutDashboard },
    { href: '/admin/payment', label: 'VERIFIKASI DANA', icon: CreditCard },
    { href: '/admin/document', label: 'VERIFIKASI BERKAS', icon: FileCheck2 },
    { href: '/admin/attendance', label: 'PRESENSI QR', icon: QrCode },
    { href: '/admin/events', label: 'MANAJEMEN EVENT', icon: Calendar },
    { href: '/admin/scoring', label: 'LIVE SCORING', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex bg-zinc-100 text-foreground font-sans">
      <aside className="w-72 bg-white border-r-4 border-foreground flex flex-col py-8 z-20 shadow-brutal-lg">
        
        <div className="mb-10 px-6">
          <h2 className="font-heading text-4xl font-black text-foreground italic uppercase tracking-wide">SEKRETARIAT.</h2>
          <span className="inline-block mt-2 font-bold text-xs px-2 py-1 bg-blue-900 text-white uppercase border-2 border-foreground">System Administrator</span>
        </div>

        <nav className="w-full flex-1 px-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-4 mb-3 border-4 transition-none ${
                  isActive 
                    ? 'bg-accent border-foreground text-foreground shadow-[4px_4px_0_0_#000] font-bold' 
                    : 'bg-white border-transparent text-zinc-600 hover:border-foreground hover:shadow-brutal-sm font-bold'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-foreground' : 'text-zinc-600'}`} />
                <span className="text-sm tracking-widest">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="w-full mt-auto pt-6 border-t-4 border-dashed border-zinc-200 px-4">
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start rounded-none border-4 border-transparent hover:border-red-600 hover:bg-red-600 hover:text-white text-red-600 font-bold tracking-widest uppercase transition-none h-12">
            <LogOut className="w-5 h-5 mr-3" />
            TERPUTUS
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 h-screen overflow-y-auto bg-zinc-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
