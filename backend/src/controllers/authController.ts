import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string().min(2),
  role: z.enum(['buyer', 'seller']),
  phone: z.string().length(10),
});

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { email, password, full_name, role, phone } = validatedData;

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { full_name, role, phone },
    });

    if (authError) return res.status(400).json({ success: false, message: authError.message });

    // 2. Create profile in our custom profiles table
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user?.id,
      username: email.split('@')[0], // Simple default username
      full_name,
      role,
      created_at: new Date().toISOString(),
    });

    if (profileError) {
      // Rollback: delete auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user?.id!);
      return res.status(400).json({ success: false, message: profileError.message });
    }

    res.status(201).json({ success: true, message: 'User registered successfully. Please verify your email/phone.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(401).json({ success: false, message: error.message });

    res.status(200).json({
      success: true,
      token: data.session?.access_token,
      user: data.user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, token } = req.body;

    const { data, error } = await supabase.auth.verifyOTP({
      email,
      token,
      type: 'signup',
    });

    if (error) return res.status(400).json({ success: false, message: error.message });

    res.status(200).json({ success: true, session: data.session });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
