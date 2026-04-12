import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/merch/product-card';
import { ShoppingCart } from 'lucide-react';
import { CartDrawer } from '@/components/merch/cart-drawer';
import { cookies } from 'next/headers';

export const revalidate = 60; // Revalidate every minute

export default async function MerchShopPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      include: {
        variants: true,
      },
    });
  } catch (error) {
    console.warn("DB unreachable during build, falling back to empty products", error);
  }

  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('session_token');

  return (
    <div className="min-h-screen bg-zinc-50 pt-20 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <header className="mb-12 border-b-4 border-foreground pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-6xl font-black uppercase tracking-wide text-[#001F3F]">
              OFFICIAL MERCHANDISE.
            </h1>
            <p className="text-lg text-zinc-600 font-bold border-l-4 border-accent pl-4 mt-4 uppercase tracking-wider">
              YMCC VII EXCLUSIVE GEAR & SOUVENIRS
            </p>
          </div>
          
          <div className="hidden md:block">
            <CartDrawer isLoggedIn={isLoggedIn} />
          </div>
        </header>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border-4 border-foreground shadow-[8px_8px_0_0_var(--color-foreground)]">
            <ShoppingCart className="w-24 h-24 text-zinc-300 mb-6" />
            <h2 className="text-3xl font-black text-foreground uppercase">STOK BELUM TERSEDIA</h2>
            <p className="font-bold text-zinc-500 uppercase mt-2">NANTIKAN PERILISAN MERCHANDISE EKSKLUSIF.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        )}
      </div>
      
      {/* Mobile Cart Floating Action Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <CartDrawer isFloating isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}
