'use client';

import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  UserCircle,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Button } from '@/components/ui/Button';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon, label, href, active }: SidebarItemProps) => (
  <a
    href={href}
    className={cn(
      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium',
      active
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    )}
  >
    {icon}
    <span>{label}</span>
  </a>
);

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4">
        <div className="flex items-center gap-2 px-4 py-6">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-slate-900">Seller Hub</span>
        </div>

        <nav className="flex-1 space-y-2 mt-6">
          <SidebarItem icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" href="/dashboard" active />
          <SidebarItem icon={<Package className="h-5 w-5" />} label="My Products" href="/products" />
          <SidebarItem icon={<ShoppingCart className="h-5 w-5" />} label="Orders" href="/orders" />
          <SidebarItem icon={<TrendingUp className="h-5 w-5" />} label="Analytics" href="/analytics" />
          <SidebarItem icon={<UserCircle className="h-5 w-5" />} label="Store Profile" href="/profile" />
        </nav>

        <div className="pt-4 border-t border-slate-100">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => { logout(); window.location.href = '/login'; }}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}

// Add missing import for ShoppingBag
import { ShoppingBag } from 'lucide-react';
