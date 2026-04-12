'use client';

import { LayoutDashboard, CreditCard, FileCheck2, QrCode, Calendar, BarChart3 } from 'lucide-react';
import { InternalSidebar } from '@/components/ui/internal-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminLinks = [
    { href: '/admin', label: 'STATISTIK', icon: LayoutDashboard },
    { href: '/admin/payment', label: 'VERIFIKASI DANA', icon: CreditCard },
    { href: '/admin/document', label: 'VERIFIKASI BERKAS', icon: FileCheck2 },
    { href: '/admin/attendance', label: 'PRESENSI QR', icon: QrCode },
    { href: '/admin/events', label: 'MANAJEMEN EVENT', icon: Calendar },
    { href: '/admin/scoring', label: 'LIVE SCORING', icon: BarChart3 },
  ];

  return (
    <InternalSidebar portalName="Admin Sekretariat" navLinks={adminLinks}>
      {children}
    </InternalSidebar>
  );
}
