'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/ui/ProductCard';
import { ShoppingBag, MapPin, Store, Search, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function HomePage() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await api.get(`/products/semantic?query=${encodeURIComponent(searchQuery)}`);
      if (response.data.success) {
        const results = response.data.data.map((p: any) => ({
          ...p,
          seller_name: p.profiles?.username || 'Local Seller',
          is_verified: true, // Default to true for now
        }));
        setProducts(results);
        toast.success(`Found ${results.length} local matches!`);
      }
    } catch (error: any) {
      toast.error('Failed to fetch AI recommendations.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial featured products
    const fetchInitial = async () => {
      try {
        const response = await api.get('/products');
        if (response.data.success) {
          const results = response.data.data.map((p: any) => ({
            ...p,
            seller_name: p.profiles?.username || 'Local Seller',
            is_verified: true,
          }));
          setProducts(results.slice(0, 8));
        }
      } catch (e) {}
    };
    fetchInitial();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">LocalMart</span>
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/login'}>
              Login
            </Button>
          ) : (
            <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden cursor-pointer">
              <img src={user.avatar_url || 'https://via.placeholder.com/150'} alt="profile" />
            </div>
          )}
        </div>
      </header>

      {/* Hero / Search Section */}
      <main className="flex-1 p-4 space-y-8">
        <section className="text-center space-y-4 py-8">
          <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
            Your Local Market, <br />
            <span className="text-blue-600">Gone Digital.</span>
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Discover authentic products from verified local sellers in your neighborhood.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-lg mx-auto mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Search local treasures (e.g. 'warm winter wear')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 px-4 rounded-xl text-xs"
              isLoading={isLoading}
            >
              Search
            </Button>
          </form>
        </section>

        {/* Quick Links */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <MapPin />, label: 'Near Me', color: 'bg-emerald-100 text-emerald-600' },
            { icon: <Store />, label: 'Top Sellers', color: 'bg-blue-100 text-blue-600' },
            { icon: <ShoppingBag />, label: 'Trending', color: 'bg-orange-100 text-orange-600' },
            { icon: <Search />, label: 'Categories', color: 'bg-purple-100 text-purple-600' },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col items-center gap-3 cursor-pointer hover:shadow-md transition-all">
              <div className={`p-3 rounded-full ${item.color}`}>
                {item.icon}
              </div>
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
            </div>
          ))}
        </section>

        {/* Products Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">
              {searchQuery ? 'AI Recommendations' : 'Featured Locals'}
            </h3>
            <a href="#" className="text-blue-600 text-sm font-medium hover:underline">View all</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={(id) => window.location.href = `/products/${id}`}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-slate-400 space-y-2">
                <div className="flex justify-center"><Search className="h-10 w-10 opacity-20" /></div>
                <p>No products found. Try a different search!</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
