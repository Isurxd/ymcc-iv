import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { CartProvider } from '@/components/merch/cart-context';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <CartProvider>
        <Navbar />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
      </CartProvider>
    </div>
  );
}