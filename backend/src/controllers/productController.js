import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { AppError } from '../middleware/errorHandler.js';

export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      subCategory,
      minPrice,
      maxPrice,
      colors,
      sizes,
      sort,
      search,
      featured,
      newArrival,
      bestSeller,
      page = 1,
      limit = 12
    } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    if (featured === 'true') query.isFeatured = true;
    if (newArrival === 'true') query.isNewArrival = true;
    if (bestSeller === 'true') query.isBestSeller = true;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (colors) {
      query['colors.name'] = { $in: colors.split(',') };
    }

    if (search) {
      query.$text = { $search: search };
    }

    let sortOption = { createdAt: -1 };
    if (sort) {
      switch (sort) {
        case 'newest': sortOption = { createdAt: -1 }; break;
        case 'price-low': sortOption = { price: 1 }; break;
        case 'price-high': sortOption = { price: -1 }; break;
        case 'rating': sortOption = { 'rating.average': -1 }; break;
        case 'featured': sortOption = { isFeatured: -1, createdAt: -1 }; break;
      }
    }

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      products
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    const reviews = await Review.find({ product: product._id, isApproved: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    })
      .limit(4)
      .lean();

    res.status(200).json({
      success: true,
      product,
      reviews,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .limit(8)
      .lean();

    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

export const getNewArrivals = async (req, res, next) => {
  try {
    const products = await Product.find({ isNewArrival: true, isActive: true })
      .limit(8)
      .lean();

    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

export const getBestSellers = async (req, res, next) => {
  try {
    const products = await Product.find({ isBestSeller: true, isActive: true })
      .limit(8)
      .lean();

    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(200).json({ success: true, products: [] });
    }

    const products = await Product.find(
      { $text: { $search: q }, isActive: true },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(10)
      .lean();

    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// Admin controllers
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

export const getAllProductsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error) {
    next(error);
  }
};