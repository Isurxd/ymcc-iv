'use client';

import { ShoppingCart, Package } from 'lucide-react';
import { InternalSidebar } from '@/components/ui/internal-sidebar';

export default function FundraisingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fundraisingLinks = [
    { href: '/fundraising', label: 'PESANAN MASUK', icon: ShoppingCart },
    { href: '/fundraising/inventory', label: 'KATALOG STOK', icon: Package },
  ];

  return (
    <InternalSidebar portalName="Divisi Danus" navLinks={fundraisingLinks}>
      {children}
    </InternalSidebar>
  );
}
