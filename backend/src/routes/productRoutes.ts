import express from 'express';
import { createProduct, getProducts, getProductById } from '../controllers/productController';
import { createCategory, getCategories } from '../controllers/categoryController';
import { generateProductDescription, semanticSearch } from '../controllers/aiController';
import { authenticate, authorizeRole } from '../middlewares/authMiddleware';

const router = express.Router();

// Categories
router.get('/categories', getCategories);
router.post('/categories', authenticate, authorizeRole('admin'), createCategory);

// Products
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, authorizeRole('seller'), createProduct);

// AI & Semantic Discovery
router.post('/ai/generate-description', authenticate, authorizeRole('seller'), generateProductDescription);
router.get('/semantic', semanticSearch);

export default router;
