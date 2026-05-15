import express from 'express';
import { createOrder, updateOrderStatus, confirmDelivery } from '../controllers/orderController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticate, createOrder);
router.patch('/:id/status', authenticate, updateOrderStatus);
router.post('/:id/confirm', authenticate, confirmDelivery);

export default router;
