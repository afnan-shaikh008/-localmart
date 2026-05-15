import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabaseClient';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    // Attach user to request for later use in controllers
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Authentication error' });
  }
};

export const authorizeRole = (role: 'buyer' | 'seller' | 'admin') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error || data?.role !== role) {
        return res.status(403).json({ success: false, message: `Forbidden: ${role} access required` });
      }

      next();
    } catch (error) {
      res.status(500).json({ success: false, message: 'Authorization error' });
    }
  };
};
