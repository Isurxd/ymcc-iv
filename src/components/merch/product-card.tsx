'use client';

import { useState } from 'react';
import { Product, ProductVariant } from '@prisma/client';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useCart } from './cart-context';

import { useRouter } from 'next/navigation';

type ProductWithVariants = Product & {
  variants: ProductVariant[];
};

export function ProductCard({ product, isLoggedIn = false }: { product: ProductWithVariants, isLoggedIn?: boolean }) {
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
    <Card className="bg-white border-4 border-foreground shadow-[6px_6px_0_0_var(--color-foreground)] rounded-none flex flex-col h-full transform transition-transform hover:-translate-y-1">
      <CardHeader className="p-0 border-b-4 border-foreground relative overflow-hidden group">
        <div className="aspect-square bg-zinc-100 flex items-center justify-center relative">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-200">
              <ShoppingBag className="w-16 h-16 text-zinc-400 mb-2" />
              <span className="text-zinc-500 font-bold text-sm uppercase">TIDAK ADA FOTO</span>
            </div>
          )}
          
          {/* Price Tag Badge */}
          <div className="absolute top-4 right-4 bg-accent text-foreground font-bold border-2 border-foreground px-3 py-1 drop-shadow-[4px_4px_0_#001F3F] [-webkit-text-stroke:1px_#001F3F]">
            Rp {(product.price / 1000)}k
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 flex-grow flex flex-col">
        <h3 className="font-heading text-2xl uppercase italic leading-tight text-foreground mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-zinc-600 font-medium mb-4 flex-grow line-clamp-3">
          {product.description}
        </p>

        {/* Size Selection */}
        {product.variants.length > 0 && (
          <div className="mt-auto pt-4 border-t-2 border-dashed border-zinc-200">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">UKURAN (PILIH SALAH SATU)</p>
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
                      w-10 h-10 border-2 font-bold uppercase text-sm flex items-center justify-center transition-colors
                      ${isSelected 
                        ? 'bg-foreground text-white border-foreground shadow-brutal-sm' 
                        : 'bg-white text-foreground border-zinc-300 hover:border-foreground'}
                      ${isVariantOut ? 'opacity-50 cursor-not-allowed bg-zinc-100' : ''}
                    `}
                    title={`Stok didapat: ${variant.stock}`}
                  >
                    {variant.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-0 border-t-4 border-foreground">
        <Button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full h-16 rounded-none text-xl font-heading uppercase italic tracking-wider transition-all
            bg-primary hover:bg-orange-500 text-white
            disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed"
        >
          {isOutOfStock ? 'STOK HABIS' : 'TAMBAH KERANJANG'}
        </Button>
      </CardFooter>
    </Card>
  );
}
