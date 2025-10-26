const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    type: String,
    default: []
  }],
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  detailedDescription: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  newArrival: {
    type: Boolean,
    default: false
  },
  specifications: {
    material: {
      type: String,
      default: ''
    },
    care: {
      type: String,
      default: ''
    },
    origin: {
      type: String,
      default: ''
    },
    sustainableFeatures: [{
      type: String,
      default: []
    }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);