'use client';

import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, TrendingUp, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import SellerLayout from '@/components/seller/SellerLayout';

export default function SellerDashboard() {
  return (
    <SellerLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Store Overview</h1>
            <p className="text-slate-500">Welcome back, here is what is happening today.</p>
          </div>
          <Button onClick={() => window.location.href = '/products/add'}>
            Add New Product
          </Button>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Earnings', value: '₹45,200', icon: <TrendingUp />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Pending Orders', value: '12', icon: <ShoppingCart />, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Active Listings', value: '24', icon: <Package />, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Store Rating', value: '4.8', icon: <UserCircle />, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className={`w-10 h-10 ${kpi.bg} ${kpi.color} rounded-xl flex items-center justify-center`}>
                {kpi.icon}
              </div>
              <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
              <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Recent Orders</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Buyer #{100 + i}</p>
                      <p className="text-xs text-slate-400">Order #LM-829{i}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-md">Packed</span>
                    <span className="text-sm font-bold text-slate-900">₹1,200</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Low Stock Alerts</h3>
            <div className="space-y-3">
              {[1, 2].map((_, i) => (
                <div key={i} className="p-3 rounded-xl bg-red-50 border border-red-100 space-y-2">
                  <p className="text-sm font-medium text-red-600">Product Stock Low</p>
                  <p className="text-xs text-red-400">Only 2 items left in stock. Restock soon!</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
