import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';

export default function FundraisingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Navbar />
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-7xl">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
