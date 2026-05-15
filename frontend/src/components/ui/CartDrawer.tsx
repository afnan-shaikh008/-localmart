'use client';

import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, CreditCard, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface CartItem {
  id: string;
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateQuantity = async (id: string, delta: number) => {
    try {
      await api.patch(`/cart/${id}`, { quantity: items.find(i => i.id === id)!.quantity + delta });
      setItems(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + delta } : item));
    } catch (e) { toast.error('Update failed'); }
  };

  const removeItem = async (id: string) => {
    try {
      await api.delete(`/cart/${id}`);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (e) { toast.error('Removal failed'); }
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Overlay */} la
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-blue-600" /> Your Cart
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="h-5 w-5" /></Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <ShoppingBag className="h-12 w-12 text-slate-300" />
              <p className="text-slate-500">Your cart is empty.</p>
              <Button variant="outline" onClick={onClose}>Start Shopping</Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="h-16 w-16 bg-slate-200 rounded-lg overflow-hidden">
                  <img src={item.image_url || 'https://via.placeholder.com/150'} alt={item.title} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-slate-900 line-clamp-1">{item.title}</p>
                  <p className="text-blue-600 font-bold text-sm">₹{item.price}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-100"><Minus className="h-3 w-3" /></button>
                      <span className="px-2 text-xs font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-100"><Plus className="h-3 w-3" /></button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-sm">Subtotal</span>
            <span className="font-medium">₹{total.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-lg font-bold text-slate-900">
            <span>Total Amount</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <Button
            className="w-full py-6 text-lg gap-2"
            disabled={items.length === 0}
            onClick={() => window.location.href = '/checkout'}
          >
            <CreditCard className="h-5 w-5" /> Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
