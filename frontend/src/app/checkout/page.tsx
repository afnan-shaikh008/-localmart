'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { MapPin, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return toast.error('Please enter delivery address');
    setStep(2);
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // 1. Create Order in Backend
      const orderRes = await api.post('/orders', {
        seller_id: 'some-seller-id', // Simplified for demo
        items: [{ product_id: 'some-id', quantity: 1 }],
        delivery_type: 'home',
        shipping_address: address,
      });

      if (orderRes.data.success) {
        // 2. Trigger Razorpay payment (Simulation)
        toast.success('Payment processing through Razorpay...');
        setTimeout(() => {
          setStep(3);
          toast.success('Order placed and funds held in Escrow!');
        }, 2000);
      }
    } catch (error: any) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center space-y-6 border border-slate-100">
          <div className="flex justify-center">
            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-full">
              <CheckCircle2 className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Order Confirmed!</h1>
          <p className="text-slate-500">Your payment has been held securely in escrow. The seller will be notified immediately.</p>
          <Button className="w-full" onClick={() => window.location.href = '/'}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Secure Checkout</h2>
          <div className="flex gap-2">
            <div className={cn("h-2 w-8 rounded-full", step >= 1 ? "bg-white" : "bg-white/30")} />
            <div className={cn("h-2 w-8 rounded-full", step >= 2 ? "bg-white" : "bg-white/30")} />
          </div>
        </div>

        <div className="p-8 space-y-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-800">Delivery Address</h3>
              </div>
              <div className="space-y-4">
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Enter your full address with landmark..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Button className="w-full" onClick={handleAddressSubmit}>
                  Save Address & Continue
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-800">Payment Method</h3>
              </div>
              <div className="space-y-3">
                <div className="p-4 border-2 border-blue-600 bg-blue-50 rounded-xl flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg"><CreditCard className="h-5 w-5 text-blue-600" /></div>
                    <span className="font-medium text-slate-900">UPI / Credit Card / Net Banking</span>
                  </div>
                  <div className="h-4 w-4 bg-blue-600 rounded-full" />
                </div>
                <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg"><ShoppingBag className="h-5 w-5 text-slate-500" /></div>
                    <span className="font-medium text-slate-600">Cash on Delivery (COD)</span>
                  </div>
                  <div className="h-4 w-4 border-2 border-slate-300 rounded-full" />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your payment is processed through Razorpay and held in escrow. Funds are only released to the seller once you confirm receipt of the product.
                </p>
              </div>

              <Button className="w-full py-6 text-lg" isLoading={isLoading} onClick={handlePayment}>
                Pay Now & Place Order
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
