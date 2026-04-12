'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CartItem = {
  id: string; // The cart item unique id
  variantId: string;
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  imageUrl: string;
  maxStock: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('ymcc_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart');
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('ymcc_cart', JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    setItems(current => {
      // Check if variant already exists in cart
      const existingKey = current.findIndex(i => i.variantId === newItem.variantId);
      
      if (existingKey >= 0) {
        // Increment quantity if possible
        const existing = current[existingKey];
        const newQuantity = existing.quantity + newItem.quantity;
        if (newQuantity <= existing.maxStock) {
          const updated = [...current];
          updated[existingKey] = { ...existing, quantity: newQuantity };
          return updated;
        }
        return current; // Don't add if stock exceeded
      }
      
      // Add new item
      return [...current, { ...newItem, id: Math.random().toString(36).substr(2, 9) }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(current => current.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(id);
    
    setItems(current => 
      current.map(item => {
        if (item.id === id) {
           return { ...item, quantity: Math.min(quantity, item.maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider 
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
