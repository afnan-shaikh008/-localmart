'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { ShieldCheck } from 'lucide-react';

export default function VerifyOtpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', { email, token: otp });
      if (response.data.success) {
        toast.success('Account verified successfully!');
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <ShieldCheck className="h-8 w-8" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Verify Your Account</h1>
        <p className="text-slate-500 mt-2 mb-8">Enter the 6-digit code sent to your email</p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Verification Code</label>
            <input
              type="text"
              maxLength={6}
              required
              className="w-full px-4 py-2 text-center text-2xl tracking-widest border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Verify Account
          </Button>
        </form>

        <div className="mt-6 text-sm text-slate-500">
          Didn't receive a code?{' '}
          <button className="text-blue-600 font-semibold hover:underline">Resend OTP</button>
        </div>
      </div>
    </div>
  );
}
