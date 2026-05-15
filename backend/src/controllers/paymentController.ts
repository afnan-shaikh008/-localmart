import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import { supabase } from '../services/supabaseClient';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export const createPaymentOrder = async (req: Request, res: Response) => {
  try {
    const { amount, orderId } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects paise
      currency: 'INR',
      receipt: orderId,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({ success: true, razorpayOrderId: order.id, amount: order.amount });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const sign = razorpay.verifyPaymentSignature(
      { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
      razorpay_signature
    );

    if (!sign) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Update payment status to 'held' in Escrow
    const { error } = await supabase
      .from('payments')
      .update({ status: 'held' })
      .eq('order_id', orderId);

    if (error) return res.status(400).json({ success: false, message: error.message });

    res.status(200).json({ success: true, message: 'Payment verified and held in escrow' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
