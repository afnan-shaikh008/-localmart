import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(2).max(50),
  parent_id: z.string().uuid().optional(),
});

export const createCategory = async (req: Request, res: Response) => {
  try {
    const validatedData = categorySchema.parse(req.body);
    const { data, error } = await supabase
      .from('categories')
      .insert([validatedData])
      .select()
      .single();

    if (error) return res.status(400).json({ success: false, message: error.message });
    res.status(201).json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.issues });
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
