import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Gallery from '../models/Gallery.js';
import { connectDB } from '../config/db.js';

const sampleProducts = [
  {
    name: 'Handmade Crochet Flower Bouquet',
    slug: 'handmade-crochet-flower-bouquet',
    description: 'A beautiful bouquet of handmade crochet flowers including roses, daisies, and tulips. Each flower is individually crocheted with love using premium cotton yarn. Perfect for home decor, gifts, or as a lasting keepsake.',
    shortDescription: 'Eternal blooms crafted with love',
    price: 1299,
    originalPrice: 1599,
    category: 'Flowers',
    subCategory: 'Bouquets',
    images: [
      { url: 'https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=800', alt: 'Crochet flower bouquet' }
    ],
    colors: [
      { name: 'Pink Mix', hex: '#FCE7F3' },
      { name: 'White & Cream', hex: '#FDF2F8' },
      { name: 'Pastel Rainbow', hex: '#F0FDF4' }
    ],
    sizes: [
      { name: 'Small (7 flowers)', price: 1299, stock: 15 },
      { name: 'Medium (12 flowers)', price: 1899, stock: 10 },
      { name: 'Large (20 flowers)', price: 2499, stock: 5 }
    ],
    stock: 30,
    sku: 'CD-FLW-BQT-001',
    tags: ['flowers', 'bouquet', 'gift', 'home decor', 'handmade'],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isCustomizable: true,
    preparationTime: 7,
    careInstructions: [
      'Keep away from excessive moisture',
      'Spot clean gently with a damp cloth',
      'Do not bleach or use harsh chemicals',
      'Store in a dry place when not displayed',
      'Handle delicate handmade pieces carefully'
    ],
    materials: ['Premium Cotton Yarn', 'Wire Stems', 'Floral Tape'],
    dimensions: { length: 30, width: 25, height: 40, weight: 200 },
    seoTitle: 'Handmade Crochet Flower Bouquet - Eternal Blooms | Crochet_Diariiies',
    seoDescription: 'Beautiful handmade crochet flower bouquets made with premium cotton yarn. Perfect gifts that last forever.',
    rating: { average: 4.9, count: 47 }
  },
  {
    name: 'Crochet Tulip Flower',
    slug: 'crochet-tulip-flower',
    description: 'A single elegant crochet tulip flower, perfect for creating your own bouquet or as a minimal decor piece. Made with soft cotton yarn and wire stem for posing.',
    shortDescription: 'Elegant single tulip, forever fresh',
    price: 299,
    category: 'Flowers',
    subCategory: 'Single Flowers',
    images: [
      { url: 'https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=800', alt: 'Crochet tulip flower' }
    ],
    colors: [
      { name: 'Soft Pink', hex: '#FCE7F3' },
      { name: 'Cream White', hex: '#FDF2F8' },
      { name: 'Lavender', hex: '#F3E8FF' },
      { name: 'Peach', hex: '#FFEDD5' }
    ],
    sizes: [
      { name: 'Standard', price: 299, stock: 50 }
    ],
    stock: 200,
    sku: 'CD-FLW-TUL-001',
    tags: ['tulip', 'flower', 'single stem', 'decor'],
    isFeatured: true,
    isNewArrival: true,
    preparationTime: 3,
    careInstructions: ['Keep away from moisture', 'Gentle dusting only'],
    materials: ['Cotton Yarn', 'Wire Stem'],
    dimensions: { length: 5, width: 5, height: 30, weight: 15 },
    rating: { average: 4.8, count: 89 }
  },
  {
    name: 'Crochet Daisy Keychain',
    slug: 'crochet-daisy-keychain',
    description: 'Adorable handmade crochet daisy keychain with a sturdy metal clasp. Perfect for keys, bags, or as a cute accessory. Each daisy is made with attention to detail.',
    shortDescription: 'Carry a little sunshine everywhere',
    price: 199,
    category: 'Keychains',
    subCategory: 'Flower Keychains',
    images: [
      { url: 'https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=800', alt: 'Crochet daisy keychain' }
    ],
    colors: [
      { name: 'Classic White', hex: '#FFFFFF' },
      { name: 'Sunny Yellow', hex: '#FEF08A' },
      { name: 'Blush Pink', hex: '#FCE7F3' }
    ],
    sizes: [
      { name: 'Standard', price: 199, stock: 100 }
    ],
    stock: 300,
    sku: 'CD-KEY-DSY-001',
    tags: ['keychain', 'daisy', 'accessory', 'gift'],
    isFeatured: true,
    isBestSeller: true,
    preparationTime: 2,
    careInstructions: ['Avoid water exposure', 'Gentle handling'],
    materials: ['Cotton Yarn', 'Metal Keyring'],
    dimensions: { length: 4, width: 4, height: 8, weight: 10 },
    rating: { average: 4.9, count: 156 }
  },
  {
    name: 'Crochet Tote Bag',
    slug: 'crochet-tote-bag',
    description: 'Spacious and stylish crochet tote bag, perfect for groceries, beach days, or everyday use. Made with durable cotton blend yarn and reinforced handles.',
    shortDescription: 'Carry your world in handmade style',
    price: 899,
    originalPrice: 1099,
    category: 'Bags',
    subCategory: 'Tote Bags',
    images: [
      { url: 'https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=800', alt: 'Crochet tote bag' }
    ],
    colors: [
      { name: 'Natural Beige', hex: '#F5F0E8' },
      { name: 'Sage Green', hex: '#DCFCE7' },
      { name: 'Dusty Rose', hex: '#FCE7F3' },
      { name: 'Warm Brown', hex: '#EDE9E6' }
    ],
    sizes: [
      { name: 'Medium', price: 899, stock: 20 },
      { name: 'Large', price: 1199, stock: 15 }
    ],
    stock: 35,
    sku: 'CD-BAG-TOT-001',
    tags: ['tote', 'bag', 'shopping', 'beach', 'eco-friendly'],
    isFeatured: true,
    isBestSeller: true,
    preparationTime: 10,
    careInstructions: ['Hand wash in cold water', 'Lay flat to dry', 'Do not wring'],
    materials: ['Cotton Blend Yarn', 'Cotton Lining'],
    dimensions: { length: 35, width: 15, height: 40, weight: 300 },
    rating: { average: 4.7, count: 63 }
  },
  {
    name: 'Crochet Hair Accessories Set',
    slug: 'crochet-hair-accessories-set',
    description: 'Set of 3 handmade crochet hair accessories including scrunchies and hair clips. Soft, gentle on hair, and absolutely adorable.',
    shortDescription: 'Pretty hair days, every day',
    price: 399,
    category: 'Accessories',
    subCategory: 'Hair Accessories',
    images: [
      { url: 'https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=800', alt: 'Crochet hair accessories' }
    ],
    colors: [
      { name: 'Pastel Set', hex: '#F3E8FF' },
      { name: 'Neutral Set', hex: '#F5F0E8' },
      { name: 'Floral Set', hex: '#FCE7F3' }
    ],
    sizes: [
      { name: 'Set of 3', price: 399, stock: 40 }
    ],
    stock: 120,
    sku: 'CD-ACC-HAIR-001',
    tags: ['hair accessories', 'scrunchie', 'hair clip', 'set'],
    isNewArrival: true,
    preparationTime: 4,
    careInstructions: ['Hand wash gently', 'Air dry'],
    materials: ['Cotton Yarn', 'Elastic', 'Metal Clips'],
    dimensions: { length: 10, width: 5, height: 3, weight: 20 },
    rating: { average: 4.8, count: 78 }
  },
  {
    name: 'Crochet Mini Shoulder Bag',
    slug: 'crochet-mini-shoulder-bag',
    description: 'Cute and compact crochet mini shoulder bag with adjustable strap. Perfect for essentials - phone, wallet, keys. A statement piece for any outfit.',
    shortDescription: 'Tiny bag, big personality',
    price: 699,
    category: 'Bags',
    subCategory: 'Mini Bags',
    images: [
      { url: 'https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=800', alt: 'Crochet mini shoulder bag' }
    ],
    colors: [
      { name: 'Cream', hex: '#FDF2F8' },
      { name: 'Blush', hex: '#FCE7F3' },
      { name: 'Mint', hex: '#F0FDF4' }
    ],
    sizes: [
      { name: 'One Size', price: 699, stock: 25 }
    ],
    stock: 75,
    sku: 'CD-BAG-MIN-001',
    tags: ['mini bag', 'shoulder bag', 'crossbody', 'cute'],
    isFeatured: true,
    preparationTime: 8,
    careInstructions: ['Spot clean only', 'Store stuffed to maintain shape'],
    materials: ['Cotton Yarn', 'Faux Leather Strap'],
    dimensions: { length: 18, width: 8, height: 14, weight: 150 },
    rating: { average: 4.9, count: 42 }
  },
  {
    name: 'Crochet Amigurumi Bunny',
    slug: 'crochet-amigurumi-bunny',
    description: 'Adorable handmade crochet bunny plushie, perfect as a gift for all ages. Soft, huggable, and made with baby-safe materials. Each bunny has its own personality!',
    shortDescription: 'A hoppy friend for life',
    price: 799,
    category: 'Plushies',
    subCategory: 'Animals',
    images: [
      { url: 'https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=800', alt: 'Crochet bunny plushie' }
    ],
    colors: [
      { name: 'Cream', hex: '#FDF2F8' },
      { name: 'Soft Grey', hex: '#F1F5F9' },
      { name: 'Blush Pink', hex: '#FCE7F3' }
    ],
    sizes: [
      { name: 'Small (20cm)', price: 799, stock: 20 },
      { name: 'Medium (30cm)', price: 1199, stock: 15 }
    ],
    stock: 35,
    sku: 'CD-PLS-BUN-001',
    tags: ['plushie', 'amigurumi', 'bunny', 'toy', 'gift'],
    isFeatured: true,
    isNewArrival: true,
    preparationTime: 12,
    careInstructions: ['Surface clean only', 'Do not machine wash', 'Keep away from pets'],
    materials: ['Premium Cotton Yarn', 'Safety Eyes', 'Polyester Filling'],
    dimensions: { length: 15, width: 12, height: 20, weight: 100 },
    rating: { average: 5.0, count: 31 }
  },
  {
    name: 'Crochet Coasters Set of 4',
    slug: 'crochet-coasters-set',
    description: 'Set of 4 handmade crochet coasters with beautiful stitch patterns. Protect your surfaces in style. Each coaster is unique with slight variations.',
    shortDescription: 'Sip in style, protect with love',
    price: 349,
    category: 'Home Decor',
    subCategory: 'Coasters',
    images: [
      { url: 'https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=800', alt: 'Crochet coasters' }
    ],
    colors: [
      { name: 'Cream & Beige', hex: '#F5F0E8' },
      { name: 'Pastel Mix', hex: '#F3E8FF' },
      { name: 'Earth Tones', hex: '#EDE9E6' }
    ],
    sizes: [
      { name: 'Set of 4', price: 349, stock: 60 }
    ],
    stock: 180,
    sku: 'CD-HOM-COA-001',
    tags: ['coasters', 'home decor', 'kitchen', 'set'],
    isBestSeller: true,
    preparationTime: 3,
    careInstructions: ['Hand wash cold', 'Lay flat to dry'],
    materials: ['Cotton Yarn'],
    dimensions: { length: 10, width: 10, height: 1, weight: 40 },
    rating: { average: 4.6, count: 54 }
  },
  {
    name: 'Crochet Gift Box - Curated Collection',
    slug: 'crochet-gift-box-curated',
    description: 'Beautifully curated gift box containing a mini bouquet, keychain, coaster, and a handwritten note. Perfect for birthdays, anniversaries, or just because.',
    shortDescription: 'The perfect gift, ready to give',
    price: 1499,
    originalPrice: 1799,
    category: 'Gifts',
    subCategory: 'Gift Boxes',
    images: [
      { url: 'https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=800', alt: 'Crochet gift box' }
    ],
    colors: [
      { name: 'Blush Theme', hex: '#FCE7F3' },
      { name: 'Neutral Theme', hex: '#F5F0E8' },
      { name: 'Spring Theme', hex: '#F0FDF4' }
    ],
    sizes: [
      { name: 'Standard Box', price: 1499, stock: 20 }
    ],
    stock: 60,
    sku: 'CD-GFT-BOX-001',
    tags: ['gift box', 'curated', 'birthday', 'anniversary', 'present'],
    isFeatured: true,
    isBestSeller: true,
    isCustomizable: true,
    preparationTime: 5,
    careInstructions: ['Store in cool, dry place', 'Handle with care'],
    materials: ['Assorted Crochet Items', 'Gift Box', 'Tissue Paper', 'Ribbon'],
    dimensions: { length: 25, width: 20, height: 10, weight: 400 },
    rating: { average: 4.9, count: 88 }
  }
];

const sampleGallery = [
  { category: 'products', caption: 'Fresh tulip bouquet', order: 1 },
  { category: 'behind-the-scenes', caption: 'Morning crochet session', order: 2 },
  { category: 'work-in-progress', caption: 'Bunny taking shape', order: 3 },
  { category: 'packaging', caption: 'Gift box ready to ship', order: 4 },
  { category: 'lifestyle', caption: 'Cozy corner with crochet', order: 5 },
  { category: 'workshop', caption: 'Yarn organization', order: 6 },
  { category: 'products', caption: 'Mini bag collection', order: 7 },
  { category: 'behind-the-scenes', caption: 'Color palette planning', order: 8 }
];

async function seed() {
  await connectDB();

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Gallery.deleteMany({})
  ]);

  // Create admin user
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@crochetdiaries.com',
    phone: '9876543210',
    password: 'admin123',
    role: 'admin'
  });

  // Create sample customer
  const customer = await User.create({
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876543211',
    password: 'customer123',
    role: 'customer'
  });

  // Create products
  const products = await Product.insertMany(sampleProducts);

  // Create gallery images (using placeholder images)
  const galleryImages = sampleGallery.map((g, i) => ({
    image: {
      url: `https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=600&q=80&sat=-20&hue=30&brightness=10${i}`,
      publicId: `crochet-diaries/gallery/${i + 1}`
    },
    alt: g.caption,
    category: g.category,
    caption: g.caption,
    order: g.order,
    isInstagram: i < 6,
    instagramUrl: `https://instagram.com/crochet_diariiies`
  }));
  await Gallery.insertMany(galleryImages);

  console.log('✅ Database seeded successfully!');
  console.log(`Admin: admin@crochetdiaries.com / admin123`);
  console.log(`Customer: priya@example.com / customer123`);
  console.log(`Products: ${products.length}`);
  console.log(`Gallery: ${galleryImages.length}`);

  process.exit(0);
}

seed().catch(console.error);