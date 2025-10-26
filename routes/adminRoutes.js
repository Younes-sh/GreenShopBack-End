const express = require('express');
const { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getAdminProducts 
} = require('../controllers/productController');
const upload = require('../middleware/memoryUpload');

const router = express.Router();


router.get('/products', getAdminProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);



module.exports = router;

