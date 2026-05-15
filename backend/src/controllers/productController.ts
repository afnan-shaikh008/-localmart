import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';
import { z } from 'zod';

const productSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  category_id: z.string().uuid(),
  // Variants and images will be handled in separate endpoints or as arrays
});

export const createProduct = async (req: Request, res: Response) => {
  try {
    const validatedData = productSchema.parse(req.body);
    const sellerId = (req as any).user.id;

    const { data, error } = await supabase
      .from('products')
      .insert([{ ...validatedData, seller_id: sellerId }])
      .select()
      .single();

    if (error) return res.status(400).json({ success: false, message: error.message });

    res.status(201).json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
  return res.status(400).json({
    success: false,
    message: error.issues
  });
}
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, minPrice, maxPrice, radius, lat, lng } = req.query;
    let query = supabase.from('products').select('*, profiles(username, role)');

    if (category) query = query.eq('category_id', category);
    if (minPrice) query = query.gte('price', minPrice);
    if (maxPrice) query = query.lte('price', maxPrice);

    // Local discovery: Filter by seller location radius (simplified)
    // In a real scenario, we'd use a RPC call for ST_DWithin
    if (radius && lat && lng) {
      const { data: localSellers, error: locError } = await supabase.rpc('get_sellers_in_radius', {
        latitude: lat,
        longitude: lng,
        radius_meters: radius,
      });
      if (!locError && localSellers) {
        const sellerIds = localSellers.map((s: any) => s.id);
        query = query.in('seller_id', sellerIds);
      }
    }

    const { data, error } = await query;
    if (error) return res.status(400).json({ success: false, message: error.message });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fixed' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('products')
      .select('*, profiles(username, role), categories(name)')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ success: false, message: 'Product not found' });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
