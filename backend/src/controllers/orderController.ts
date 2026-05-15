import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';
import { z } from 'zod';

const orderSchema = z.object({
  seller_id: z.string().uuid(),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1),
  delivery_type: z.enum(['pickup', 'home']),
  shipping_address: z.string().optional(),
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const validatedData = orderSchema.parse(req.body);
    const buyerId = (req as any).user.id;
    const { seller_id, items, delivery_type, shipping_address } = validatedData;

    // 1. Calculate total and validate stock
    let totalAmount = 0;
    for (const item of items) {
      const { data: product, error: pError } = await supabase
        .from('products')
        .select('price, stock')
        .eq('id', item.product_id)
        .single();

      if (pError || !product) return res.status(404).json({ success: false, message: `Product ${item.product_id} not found` });
      if (product.stock < item.quantity) return res.status(400).json({ success: false, message: `Insufficient stock for ${item.product_id}` });

      totalAmount += product.price * item.quantity;
    }

    // 2. Create Order
    const { data: order, error: oError } = await supabase
      .from('orders')
      .insert([{
        buyer_id: buyerId,
        seller_id,
        total_amount: totalAmount,
        delivery_type,
        shipping_address,
        status: 'placed',
      }])
      .select()
      .single();

    if (oError) return res.status(400).json({ success: false, message: oError.message });

    // 3. Create Order Items (Snapshot prices)
    for (const item of items) {
      const { data: product } = await supabase.from('products').select('price').eq('id', item.product_id).single();
      await supabase.from('order_items').insert([{
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: product?.price || 0,
      }]);
    }

    // 4. Create Escrow Payment record (Status: Held)
    const { error: payError } = await supabase.from('payments').insert([{
      order_id: order.id,
      amount: totalAmount,
      status: 'held',
    }]);

    if (payError) return res.status(400).json({ success: false, message: payError.message });

    res.status(201).json({ success: true, orderId: order.id, totalAmount });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.issues });
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g., 'packed', 'shipped', 'delivered'
    const sellerId = (req as any).user.id;

    // Verify the seller owns the order
    const { data: order } = await supabase
      .from('orders')
      .select('seller_id')
      .eq('id', id)
      .single();

    if (!order || order.seller_id !== sellerId) {
      return res.status(403).json({ success: false, message: 'You are not authorized to update this order' });
    }

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) return res.status(400).json({ success: false, message: error.message });

    res.status(200).json({ success: true, message: `Order status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const confirmDelivery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const buyerId = (req as any).user.id;

    // Verify buyer owns order
    const { data: order } = await supabase
      .from('orders')
      .select('buyer_id, status')
      .eq('id', id)
      .single();

    if (!order || order.buyer_id !== buyerId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // 1. Mark Order as Delivered
    await supabase.from('orders').update({ status: 'delivered' }).eq('id', id);

    // 2. Release Escrow Payment
    const { error: payError } = await supabase
      .from('payments')
      .update({ status: 'released' })
      .eq('order_id', id);

    if (payError) return res.status(400).json({ success: false, message: payError.message });

    res.status(200).json({ success: true, message: 'Delivery confirmed. Funds released to seller.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
