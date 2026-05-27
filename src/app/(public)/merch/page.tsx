import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/merch/product-card';
import { ShoppingCart, ShoppingBag } from 'lucide-react';
import { CartDrawer } from '@/components/merch/cart-drawer';
import { cookies } from 'next/headers';

export const revalidate = 60; // Revalidate every minute

export default async function MerchShopPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      include: {
        variants: true,
      }
    });
  } catch (error) {
    console.warn("DB unreachable during build, falling back to empty products", error);
  }

  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('session_token');

  return (
    <div className="min-h-screen bg-white bg-grid-dots relative overflow-x-hidden font-poppins text-[#001F3F]">
      
      {/* Brand Background Accents */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-[#CCFF00]/5 rounded-full blur-[140px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-[#E63E00]/5 rounded-full blur-[140px] -z-10" />

      <div className="container mx-auto px-6 max-w-7xl pt-10 pb-32">
        <header className="mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 bg-[#E63E00]/10 border border-[#E63E00]/20 px-5 py-2 rounded-full mb-8 shadow-[4px_4px_0_0_#001F3F]">
               <span className="w-2 h-2 bg-[#E63E00] rounded-full animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E63E00]">
                 Limited Edition Drop
               </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-[-0.05em] leading-[0.85] text-[#001F3F]">
              Official <br/> <span className="text-[#E63E00] drop-shadow-2xl">Merch.</span>
            </h1>
            
            <p className="mt-10 text-xl font-bold text-[#001F3F]/30 max-w-lg leading-relaxed uppercase italic">
              EQUIPPING THE NEXT GENERATION OF MINING LEADERS WITH EXCLUSIVE YMCC VII COLLECTIONS.
            </p>
          </div>
          
          <div className="hidden md:block">
            <CartDrawer isLoggedIn={isLoggedIn} />
          </div>
        </header>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 bg-zinc-50 rounded-[4rem] border-4 border-[#001F3F]/5 shadow-premium">
            <div className="w-24 h-24 bg-[#001F3F]/5 rounded-full flex items-center justify-center mb-10">
              <ShoppingBag className="w-10 h-10 text-[#001F3F]/20" />
            </div>
            <h2 className="text-4xl font-black text-[#001F3F] uppercase tracking-tighter">Inventory Locked</h2>
            <p className="font-bold text-[#001F3F]/30 uppercase mt-4 tracking-widest italic">Wait for the next drop cycle.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map(product => (
              <ProductCard key={product.id} product={product} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Cart Floating Action Button */}
      <div className="md:hidden fixed bottom-10 right-6 z-50">
        <CartDrawer isFloating isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}
