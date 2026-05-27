'use client';

import { useState } from 'react';
import { Product, ProductVariant } from '@prisma/client';
import { ShoppingBag, ChevronRight, ArrowRight } from 'lucide-react';
import { useCart } from './cart-context';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import { motion } from 'framer-motion';

type ProductWithVariants = Product & {
  variants: ProductVariant[];
};

export function ProductCard({ product, isLoggedIn = false }: { product: ProductWithVariants, isLoggedIn?: boolean }) {
  const { lang, t } = useLanguage();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  );
  
  const { addToCart } = useCart();
  const router = useRouter();
  
  const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
  const isOverallOutOfStock = product.variants.every(v => v.stock <= 0);
  const isSelectedVariantOut = !selectedVariant || selectedVariant.stock <= 0;

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    if (isSelectedVariantOut || !selectedVariant) return;
    
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
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border-2 border-black rounded-[3rem] p-5 group relative overflow-hidden flex flex-col h-full shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all duration-300"
    >
      {/* Sold Out Badge (Direct from Reference) */}
      {isOverallOutOfStock && (
        <div className="absolute top-8 left-8 z-20 bg-black text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-xl">
           Sold out
        </div>
      )}

      {/* Product Image Container */}
      <div className="aspect-square rounded-[2.5rem] bg-zinc-50 overflow-hidden relative mb-8 flex items-center justify-center border border-zinc-50 group-hover:bg-white transition-all">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50">
            <ShoppingBag className="w-16 h-16 text-zinc-200 mb-2" />
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="px-3 flex-grow flex flex-col">
        <h3 className="font-bold text-[22px] uppercase tracking-tighter text-black leading-tight mb-2 group-hover:text-zinc-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-6">
           <span className="font-black text-2xl italic tracking-tighter">$ {product.price / 1000}</span>
           <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Global Node</span>
        </div>

        {/* Size Selection Protocol (Only if variants exist) */}
        {product.variants.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {product.variants.map(variant => {
                const isSelected = selectedVariantId === variant.id;
                const isVariantOut = variant.stock <= 0;
                
                return (
                  <button
                    key={variant.id}
                    onClick={() => !isVariantOut && setSelectedVariantId(variant.id)}
                    disabled={isVariantOut}
                    className={`
                      px-4 py-2 rounded-xl font-bold uppercase text-[10px] transition-all
                      ${isSelected 
                        ? 'bg-[#CCFF00] border-2 border-black text-black' 
                        : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'}
                      ${isVariantOut ? 'opacity-20 line-through cursor-not-allowed' : ''}
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

      {/* Button Row */}
      <div className="mt-auto px-1">
        <button 
          onClick={handleAddToCart}
          disabled={isSelectedVariantOut}
          className={`
            w-full flex items-center justify-between px-8 py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all
            ${isSelectedVariantOut 
              ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed' 
              : 'bg-black text-white hover:bg-[#CCFF00] hover:text-black border-2 border-transparent hover:border-black shadow-[4px_4px_0px_0px_transparent] hover:shadow-[4px_4px_0px_0px_#000]'}
          `}
        >
          {isSelectedVariantOut 
            ? (lang === 'ID' ? 'Habis' : 'Sold Out') 
            : (lang === 'ID' ? 'Beli Sekarang' : 'Add to Bag')}
          {!isSelectedVariantOut && <ArrowRight size={18} />}
        </button>
      </div>
    </motion.div>
  );
}
