import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Flowers', 'Bags', 'Accessories', 'Home Decor', 'Plushies', 'Keychains', 'Gifts', 'Custom Creations']
  },
  subCategory: {
    type: String,
    trim: true
  },
  images: [{
    url: String,
    publicId: String,
    alt: String
  }],
  colors: [{
    name: String,
    hex: String,
    image: String
  }],
  sizes: [{
    name: String,
    price: Number,
    stock: Number
  }],
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  sku: {
    type: String,
    unique: true
  },
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isCustomizable: {
    type: Boolean,
    default: false
  },
  preparationTime: {
    type: Number,
    default: 7
  },
  careInstructions: [String],
  materials: [String],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  seoTitle: String,
  seoDescription: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ isNewArrival: 1, isActive: 1 });
productSchema.index({ isBestSeller: 1, isActive: 1 });

export default mongoose.model('Product', productSchema);