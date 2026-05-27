'use client';

import { useState } from 'react';
import { Product, ProductVariant } from '@prisma/client';
import { ShoppingBag, ChevronRight, Star } from 'lucide-react';
import { useCart } from './cart-context';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import { motion } from 'framer-motion';

type ProductWithVariants = Product & {
  variants: ProductVariant[];
};

export function ProductCard({ product, isLoggedIn = false }: { product: ProductWithVariants, isLoggedIn?: boolean }) {
  const { lang } = useLanguage();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  );
  
  const { addToCart } = useCart();
  const router = useRouter();
  
  const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
  const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    if (isOutOfStock || !selectedVariant) return;
    
    addToCart({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      size: selectedVariant.size,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      maxStock: selectedVariant.stock,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[4rem] p-5 shadow-soft hover:shadow-[0_40px_80px_rgba(0,31,63,0.1)] transition-all duration-700 border-[3px] border-zinc-100 hover:border-[#001F3F] group flex flex-col h-full relative"
    >
      {/* Product Image Container */}
      <div className="aspect-[4/5] rounded-[3rem] bg-zinc-50 overflow-hidden relative mb-8 border border-zinc-100">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50">
            <ShoppingBag className="w-16 h-16 text-zinc-100 mb-2" />
          </div>
        )}
        
        {/* Price Tag with Skew */}
        <div className="absolute top-6 right-6 bg-[#001F3F] text-[#CCFF00] font-black italic text-xl px-6 py-2 rounded-full shadow-2xl skew-x-[-12deg] z-20">
          Rp {(product.price / 1000)}K
        </div>
      </div>
      
      {/* Content */}
      <div className="px-5 flex-grow flex flex-col">
        <div className="mb-6">
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E63E00] mb-2 block italic">Authentic Node Item</span>
           <h3 className="font-black text-4xl uppercase tracking-tighter text-[#001F3F] leading-[0.9] mb-4 group-hover:text-[#E63E00] transition-colors">
            {product.name}
           </h3>
        </div>

        <p className="text-zinc-400 text-sm font-bold mb-10 line-clamp-2 leading-relaxed uppercase italic opacity-60">
          {product.description}
        </p>

        {/* Size Selection Protocol */}
        {product.variants.length > 0 && (
          <div className="mt-auto mb-10">
            <div className="flex flex-wrap gap-3">
              {product.variants.map(variant => {
                const isSelected = selectedVariantId === variant.id;
                const isVariantOut = variant.stock <= 0;
                
                return (
                  <button
                    key={variant.id}
                    onClick={() => !isVariantOut && setSelectedVariantId(variant.id)}
                    disabled={isVariantOut}
                    className={`
                      w-13 h-13 rounded-2xl font-black uppercase text-xs flex items-center justify-center transition-all duration-500
                      ${isSelected 
                        ? 'bg-[#001F3F] text-white shadow-xl scale-110' 
                        : 'bg-zinc-100 text-[#001F3F] hover:bg-[#CCFF00]'}
                      ${isVariantOut ? 'opacity-20 cursor-not-allowed' : ''}
                    `}
                  >
                    {variant.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Acquisition Trigger */}
      <div className="px-2 pb-2">
        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`
            w-full py-7 rounded-[3rem] font-black text-sm uppercase tracking-[0.2em] transition-all duration-700 flex items-center justify-center gap-4
            ${isOutOfStock 
              ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed' 
              : 'bg-[#001F3F] text-white hover:bg-[#CCFF00] hover:text-[#001F3F] shadow-xl hover:scale-[1.02] active:scale-95'}
          `}
        >
          {isOutOfStock 
            ? (lang === 'ID' ? 'STOK HABIS' : 'OUT OF STOCK') 
            : (lang === 'ID' ? 'TAMBAH KE TAS' : 'ADD TO BAG')}
          {!isOutOfStock && <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </motion.div>
  );
}
