const Product = require('../models/Product');

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching products',
      error: error.message 
    });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching product',
      error: error.message 
    });
  }
};


// Create a new product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      description,
      detailedDescription,
      tags,
      stock,
      featured,
      newArrival,
      specifications
    } = req.body;

    // پردازش تگ‌ها
    let processedTags = [];
    if (tags) {
      if (typeof tags === 'string') {
        try {
          processedTags = JSON.parse(tags);
        } catch (error) {
          // اگر JSON نبود، با کاما جدا کنیم
          processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
      } else if (Array.isArray(tags)) {
        processedTags = tags;
      }
    }

    // پردازش specifications
    let processedSpecs = {};
    if (specifications) {
      if (typeof specifications === 'string') {
        try {
          processedSpecs = JSON.parse(specifications);
        } catch (error) {
          processedSpecs = {};
        }
      } else {
        processedSpecs = specifications;
      }

      // پردازش sustainableFeatures
      if (processedSpecs.sustainableFeatures && typeof processedSpecs.sustainableFeatures === 'string') {
        processedSpecs.sustainableFeatures = processedSpecs.sustainableFeatures
          .split(',')
          .map(feature => feature.trim())
          .filter(feature => feature);
      }
    }

    // ایجاد محصول جدید
    const product = new Product({
      name,
      price: parseFloat(price),
      images: req.body.images || [], // موقتاً
      category,
      description,
      detailedDescription: detailedDescription || '',
      tags: processedTags,
      stock: parseInt(stock) || 0,
      featured: featured === 'true' || featured === true,
      newArrival: newArrival === 'true' || newArrival === true,
      specifications: {
        material: processedSpecs.material || '',
        care: processedSpecs.care || '',
        origin: processedSpecs.origin || '',
        sustainableFeatures: processedSpecs.sustainableFeatures || []
      }
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: savedProduct
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Update product by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // پردازش تگ‌ها
    if (updateData.tags) {
      if (typeof updateData.tags === 'string') {
        try {
          updateData.tags = JSON.parse(updateData.tags);
        } catch (error) {
          updateData.tags = updateData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
      }
    }

    // پردازش specifications
    if (updateData.specifications) {
      if (typeof updateData.specifications === 'string') {
        try {
          updateData.specifications = JSON.parse(updateData.specifications);
        } catch (error) {
          updateData.specifications = {};
        }
      }

      // پردازش sustainableFeatures
      if (updateData.specifications.sustainableFeatures && 
          typeof updateData.specifications.sustainableFeatures === 'string') {
        updateData.specifications.sustainableFeatures = updateData.specifications.sustainableFeatures
          .split(',')
          .map(feature => feature.trim())
          .filter(feature => feature);
      }
    }

    // تبدیل نوع داده‌ها
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);
    if (updateData.featured) updateData.featured = updateData.featured === 'true';
    if (updateData.newArrival) updateData.newArrival = updateData.newArrival === 'true';

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// Delete product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// دریافت همه محصولات (برای ادمین)
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts
};