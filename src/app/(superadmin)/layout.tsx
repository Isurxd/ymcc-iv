import { Database, ShieldAlert, Activity } from 'lucide-react';
import { InternalSidebar } from '@/components/ui/internal-sidebar';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const superadminLinks = [
    { href: '/superadmin', label: 'SYSTEM METRICS', icon: Activity },
    { href: '/superadmin/users', label: 'ACCESS CONTROL', icon: ShieldAlert },
  ];

  return (
    <InternalSidebar portalName="Superadmin Node" navLinks={superadminLinks}>
      {children}
    </InternalSidebar>
  );
}
