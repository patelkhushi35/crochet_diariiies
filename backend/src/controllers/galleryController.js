import Gallery from '../models/Gallery.js';
import { AppError } from '../middleware/errorHandler.js';

export const getGallery = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };
    
    if (category) query.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const images = await Gallery.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Gallery.countDocuments(query);

    res.status(200).json({
      success: true,
      images,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error) {
    next(error);
  }
};

export const getInstagramFeed = async (req, res, next) => {
  try {
    const images = await Gallery.find({ isInstagram: true, isActive: true })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    res.status(200).json({ success: true, images });
  } catch (error) {
    next(error);
  }
};

// Admin
export const createGalleryImage = async (req, res, next) => {
  try {
    const image = await Gallery.create(req.body);
    res.status(201).json({ success: true, image });
  } catch (error) {
    next(error);
  }
};

export const updateGalleryImage = async (req, res, next) => {
  try {
    const image = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!image) {
      return next(new AppError('Image not found', 404));
    }
    res.status(200).json({ success: true, image });
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryImage = async (req, res, next) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);
    if (!image) {
      return next(new AppError('Image not found', 404));
    }
    res.status(200).json({ success: true, message: 'Image deleted' });
  } catch (error) {
    next(error);
  }
};

export const reorderGallery = async (req, res, next) => {
  try {
    const { images } = req.body; // Array of { id, order }
    await Promise.all(images.map(({ id, order }) =>
      Gallery.findByIdAndUpdate(id, { order })
    ));
    res.status(200).json({ success: true, message: 'Order updated' });
  } catch (error) {
    next(error);
  }
};