import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, ShieldCheck, MapPin, Star, ArrowLeft } from 'lucide-react';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        if (response.data.success) {
          setProduct(response.data.data);
        }
      } catch (error: any) {
        toast.error('Product not found');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await api.post('/cart/add', { product_id: id, quantity });
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error('Could not add item to cart');
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Button variant="ghost" className="w-fit gap-2" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4" /> Back to Search
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative">
              {product.image_url ? (
                <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <ShoppingBag className="h-12 w-12" />
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-slate-100 rounded-lg border border-slate-200 cursor-pointer hover:border-blue-500 transition-all" />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-md">
                  {product.categories?.name || 'Local Special'}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                  <Star className="h-3 w-3 fill-amber-500" /> 4.8 (120 reviews)
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{product.title}</h1>
              <p className="text-2xl font-bold text-blue-600">₹{product.price}</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
              <p className="text-sm text-blue-800">
                <strong>Escrow Protected:</strong> Your payment is held securely and only released to the seller after delivery.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Description</h3>
              <div className="text-slate-600 leading-relaxed text-sm space-y-3">
                {product.ai_description || product.description || 'No description available.'}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-slate-100 transition-colors"
                >-</button>
                <span className="px-4 py-2 font-medium border-x border-slate-200">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-slate-100 transition-colors"
                >+</button>
              </div>
              <Button className="flex-1 gap-2" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </Button>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <MapPin className="h-5 w-5 text-slate-400" />
              <span className="text-sm text-slate-500">Ships from <strong>{product.profiles?.username || 'Local Seller'}</strong> in your area</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ShoppingBag } from 'lucide-react';
