'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from './cart-context';

export function CartDrawer({ isFloating = false, isLoggedIn = false }: { isFloating?: boolean, isLoggedIn?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();

  const toggleCart = () => setIsOpen(!isOpen);

  if (isFloating) {
    return (
      <>
        <button
          onClick={toggleCart}
          className="bg-accent text-foreground w-16 h-16 rounded-full border-4 border-foreground shadow-[4px_4px_0_var(--color-foreground)] flex items-center justify-center hover:-translate-y-1 transition-transform relative z-40"
        >
          <ShoppingCart className="w-8 h-8" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-foreground">
              {totalItems}
            </span>
          )}
        </button>
        {isOpen && <CartOverlay close={toggleCart} items={items} totalPrice={totalPrice} updateQuantity={updateQuantity} removeFromCart={removeFromCart} isLoggedIn={isLoggedIn} />}
      </>
    );
  }

  return (
    <>
      <button
        onClick={toggleCart}
        className="bg-zinc-100 hover:bg-zinc-200 border-4 border-foreground px-6 py-3 font-bold uppercase flex items-center gap-3 transition-colors drop-shadow-[4px_4px_0_#001F3F] [-webkit-text-stroke:1px_#001F3F]"
      >
        <ShoppingCart className="w-5 h-5" />
        KERANJANG ({totalItems})
      </button>
      {isOpen && <CartOverlay close={toggleCart} items={items} totalPrice={totalPrice} updateQuantity={updateQuantity} removeFromCart={removeFromCart} isLoggedIn={isLoggedIn} />}
    </>
  );
}

function CartOverlay({ close, items, totalPrice, updateQuantity, removeFromCart, isLoggedIn }: any) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-[100]"
        onClick={close}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] bg-white border-l-8 border-foreground z-[110] flex flex-col shadow-[inset_6px_0_0_0_var(--color-accent)]">
        <div className="p-6 border-b-4 border-foreground flex justify-between items-center bg-primary text-white pr-8">
          <h2 className="text-3xl font-heading italic uppercase flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" /> KERANJANG ANDA
          </h2>
          <button onClick={close} className="p-2 hover:bg-white hover:text-foreground border-2 border-transparent hover:border-foreground transition-colors hover:shadow-brutal-sm">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 bg-zinc-50 pl-8 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <ShoppingCart className="w-20 h-20 text-zinc-300 mb-4" />
              <p className="text-xl font-heading uppercase text-zinc-400 italic">KERANJANG KOSONG</p>
              <Button onClick={close} className="mt-6 bg-foreground text-white border-4 border-transparent hover:border-accent hover:bg-zinc-800 rounded-none shadow-brutal-sm">
                LANJUTKAN BELANJA
              </Button>
            </div>
          ) : (
            items.map((item: any) => (
              <div key={item.id} className="bg-white border-4 border-foreground p-4 flex gap-4 shadow-[4px_4px_0_0_var(--color-primary)]">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover border-2 border-foreground" />
                ) : (
                  <div className="w-20 h-20 bg-zinc-100 border-2 border-foreground flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-zinc-300" />
                  </div>
                )}
                
                <div className="flex-grow flex flex-col">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold uppercase leading-tight line-clamp-2 pr-2">{item.name}</h4>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold bg-zinc-100 border-2 border-zinc-300 px-2 rounded-sm uppercase">Ukuran: {item.size}</span>
                  </div>
                  
                  <div className="flex justify-between items-end mt-auto pt-2">
                    <span className="font-bold text-accent drop-shadow-[4px_4px_0_#001F3F] [-webkit-text-stroke:1px_#001F3F]">
                      Rp {(item.price / 1000)}k
                    </span>
                    
                    <div className="flex border-2 border-foreground">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 h-8 font-bold flex items-center justify-center border-x-2 border-foreground">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                        disabled={item.quantity >= item.maxStock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t-8 border-foreground bg-white pb-8">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-zinc-500 uppercase tracking-wider">TOTAL PEMBAYARAN</span>
              <span className="text-3xl font-heading italic text-foreground drop-shadow-[4px_4px_0_#001F3F] [-webkit-text-stroke:1px_#001F3F]">
                Rp {totalPrice.toLocaleString('id-ID')}
              </span>
            </div>
            
            <Link href={isLoggedIn ? "/checkout" : "/login"} onClick={close}>
              <Button className="w-full h-16 text-xl bg-accent hover:bg-amber-400 border-4 border-foreground text-foreground font-heading uppercase italic tracking-wider shadow-brutal transition-all hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--color-foreground)] rounded-none">
                Lanjut ke Pembayaran -&gt;
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
