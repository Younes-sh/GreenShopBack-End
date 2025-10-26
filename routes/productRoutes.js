// routes/productRoutes.js
const express = require('express');
const { 
  getProducts, 
  getProductById 
} = require('../controllers/productController');

const router = express.Router();

// Public routes - برای مشتریان
router.get('/', getProducts);           // GET /api/products
router.get('/:id', getProductById);     // GET /api/products/123

module.exports = router;