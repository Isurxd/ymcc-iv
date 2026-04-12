import { Shield, Radio, Terminal } from 'lucide-react';
import { InternalSidebar } from '@/components/ui/internal-sidebar';

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const operatorLinks = [
    { href: '/operator/control', label: 'MASTER CONTROL', icon: Radio },
    { href: '/operator/cms', label: 'CMS SYSTEM', icon: Terminal },
    { href: '/operator/cheat-monitor', label: 'CHEAT MONITOR', icon: Shield },
  ];

  return (
    <InternalSidebar portalName="Master Operator" navLinks={operatorLinks}>
      {children}
    </InternalSidebar>
  );
}
