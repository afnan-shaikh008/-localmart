'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Sparkles, Package, Image as ImageIcon, Tag } from 'lucide-react';
import SellerLayout from '@/components/seller/SellerLayout';

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    keywords: '',
  });

  const generateAIDescription = async () => {
    if (!formData.title) {
      toast.error('Please enter a product title first');
      return;
    }
    setAiLoading(true);
    try {
      const response = await api.post('/products/ai/generate-description', {
        title: formData.title,
        keywords: formData.keywords.split(',').map(k => k.trim()),
        category: 'General',
      });
      if (response.data.success) {
        setFormData({ ...formData, description: response.data.description });
        toast.success('AI generated a professional description!');
      }
    } catch (error: any) {
      toast.error('AI Generation failed.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/products', {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });
      if (response.data.success) {
        toast.success('Product listed successfully!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to list product.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SellerLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Add New Product</h1>
            <p className="text-slate-500">Create a professional listing for your local treasures</p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Basic Information
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Product Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Hand-woven Kashmiri Shawl"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Keywords (comma separated)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="wool, handmade, winter, luxury"
                      value={formData.keywords}
                      onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      className="gap-2"
                      onClick={generateAIDescription}
                      isLoading={aiLoading}
                    >
                      <Sparkles className="h-4 w-4" />
                      AI Write
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Tell buyers why your product is special..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-blue-600" />
                Product Media
              </h2>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-3 cursor-pointer hover:border-blue-400 transition-colors">
                <ImageIcon className="h-10 w-10 text-slate-300 mx-auto" />
                <p className="text-sm text-slate-500">Drag and drop images or click to upload</p>
                <p className="text-xs text-slate-400">Up to 5 high-res images (WebP, JPG, PNG)</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Tag className="h-5 w-5 text-blue-600" />
                Pricing & Stock
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Price (₹)</label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <select
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option value="uuid-1">Handmade</option>
                    <option value="uuid-2">Electronics</option>
                    <option value="uuid-3">Fashion</option>
                  </select>
                </div>
              </div>

              <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
                Publish Product
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
