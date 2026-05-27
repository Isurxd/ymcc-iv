import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/merch/product-card';
import { ShoppingBag, Zap, ShieldCheck, Activity } from 'lucide-react';
import { CartDrawer } from '@/components/merch/cart-drawer';
import { cookies } from 'next/headers';
import React from 'react';

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
    <div className="min-h-screen bg-[#F4F4F5] relative overflow-x-hidden font-poppins text-black pb-32">
      
      {/* 1. ELITE MERCH HEADER */}
      <section className="pt-24 pb-20 container mx-auto px-6 max-w-7xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20 relative z-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-3 bg-[#CCFF00] border-2 border-black px-4 py-2 rounded-full mb-8 font-black text-[10px] uppercase tracking-[0.3em] shadow-[2px_2px_0px_0px_#000]">
               <span className="w-2 h-2 bg-black rounded-full animate-ping" />
               OFFICIAL DROP ACTIVE
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-[-0.05em] leading-[0.85] text-black italic">
              OFFICIAL <br/> <span className="text-[#CCFF00] text-stroke-black" style={{ WebkitTextStroke: '2px black' }}>MERCH.</span>
            </h1>
            
            <p className="mt-10 text-xl font-bold text-zinc-400 max-w-lg leading-relaxed uppercase italic">
              EQUIPPING THE NEXT GENERATION OF LEADERS WITH EXCLUSIVE YMCC VII COLLECTIONS.
            </p>
          </div>
          
          <div className="w-full md:w-auto">
             <div className="bg-white border-2 border-black p-8 rounded-[3rem] shadow-[6px_6px_0px_0px_#000] flex items-center gap-8 group hover:bg-[#CCFF00] transition-all cursor-pointer">
                <div className="text-right">
                   <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black">Cart Status</div>
                   <div className="text-2xl font-black italic tracking-tighter group-hover:text-black">ACTIVE NODE</div>
                </div>
                <CartDrawer isLoggedIn={isLoggedIn} />
             </div>
          </div>
        </header>

        {/* 2. BENTO INVENTORY GRID */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[4rem] border-2 border-black shadow-[8px_8px_0px_0px_#000]">
            <div className="w-24 h-24 bg-zinc-100 border-2 border-black rounded-full flex items-center justify-center mb-10 shadow-[4px_4px_0px_0px_#000]">
              <ShoppingBag className="w-10 h-10 text-zinc-300" />
            </div>
            <h2 className="text-4xl font-black text-black uppercase tracking-tighter italic">Inventory Locked</h2>
            <p className="font-bold text-zinc-400 uppercase mt-4 tracking-widest italic leading-none">Wait for the next drop cycle.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map(product => (
              <ProductCard key={product.id} product={product} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        )}
      </section>

      {/* 3. LOGISTICS INFO BENTO */}
      <section className="container mx-auto px-6 max-w-7xl mt-12">
         <div className="bg-white border-2 border-black rounded-[4rem] p-12 md:p-20 shadow-[10px_10px_0px_0px_#000] flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
               <Zap size={240} />
            </div>
            
            <div className="flex-1">
               <div className="flex items-center gap-4 mb-6">
                  <ShieldCheck size={28} className="text-[#CCFF00] stroke-black" style={{ strokeWidth: 3 }} />
                  <h3 className="font-black text-3xl uppercase tracking-tighter italic leading-none">Global Logistic Sync</h3>
               </div>
               <p className="text-zinc-400 font-bold uppercase text-[11px] tracking-widest leading-relaxed max-w-xl italic">
                  All transactions are verified through our centralized node. Shipments are handled by YMCC Command with real-time tracking integration.
               </p>
            </div>

            <div className="flex gap-10">
               <div className="text-center">
                  <div className="text-4xl font-black italic tracking-tighter">SECURE</div>
                  <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Payment Loop</p>
               </div>
               <div className="text-center">
                  <div className="text-4xl font-black italic tracking-tighter">FAST</div>
                  <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Node Fulfillment</p>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
}
