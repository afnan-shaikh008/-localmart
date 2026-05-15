import React from 'react';
import { ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    avatar_url?: string;
    image_url?: string;
    rating?: number;
    review_count?: number;
    seller_name: string;
    is_verified: boolean;
  };
  onClick: (id: string) => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 p-3 space-y-3 cursor-pointer hover:shadow-lg transition-all group"
      onClick={() => onClick(product.id)}
    >
      <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative">
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <ShoppingBag className="h-8 w-8" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <span className="font-medium text-slate-700">{product.seller_name}</span>
          {product.is_verified && (
            <span className="text-blue-500 font-bold">✓ Verified</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="text-lg font-bold text-slate-900">₹{product.price}</span>
        <div className="flex items-center gap-1 text-xs font-medium text-amber-600">
          <Star className="h-3 w-3 fill-amber-600" />
          {product.rating || '4.5'}
        </div>
      </div>

      <Button size="sm" className="w-full py-1.5 text-xs" variant="primary">
        Add to Cart
      </Button>
    </div>
  );
};
