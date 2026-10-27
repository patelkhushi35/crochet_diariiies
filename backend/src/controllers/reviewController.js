import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { AppError } from '../middleware/errorHandler.js';

export const getProductReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query = { product: req.params.productId, isApproved: true };

    const skip = (Number(page) - 1) * Number(limit);
    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Review.countDocuments(query);

    // Get rating distribution
    const distribution = await Review.aggregate([
      { $match: { product: reviews[0]?.product, isApproved: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      reviews,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      distribution
    });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment, images } = req.body;

    // Check if user purchased this product
    const order = await Order.findOne({
      user: req.user.id,
      'items.product': productId,
      orderStatus: 'delivered'
    });

    if (!order) {
      return next(new AppError('You can only review products you have purchased', 400));
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ user: req.user.id, product: productId });
    if (existingReview) {
      return next(new AppError('You have already reviewed this product', 400));
    }

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      order: order._id,
      rating,
      title,
      comment,
      images: images || [],
      isVerifiedPurchase: true
    });

    await review.populate('user', 'name avatar');

    // Update product rating
    await updateProductRating(productId);

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { rating, title, comment, images } = req.body;
    const review = await Review.findOne({ _id: req.params.id, user: req.user.id });

    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    review.rating = rating;
    review.title = title;
    review.comment = comment;
    review.images = images || review.images;
    await review.save();

    await updateProductRating(review.product);

    res.status(200).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    await updateProductRating(review.product);

    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

// Admin
export const getAllReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, approved } = req.query;
    const query = {};
    if (approved !== undefined) query.isApproved = approved === 'true';

    const skip = (Number(page) - 1) * Number(limit);
    const reviews = await Review.find(query)
      .populate('user', 'name email avatar')
      .populate('product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      reviews,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error) {
    next(error);
  }
};

export const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    await updateProductRating(review.product);

    res.status(200).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

export const rejectReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true }
    );

    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    await updateProductRating(review.product);

    res.status(200).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

async function updateProductRating(productId) {
  const result = await Review.aggregate([
    { $match: { product: productId, isApproved: true } },
    { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);

  await Product.findByIdAndUpdate(productId, {
    'rating.average': Math.round((result[0]?.average || 0) * 10) / 10,
    'rating.count': result[0]?.count || 0
  });
}