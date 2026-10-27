import CustomOrder from '../models/CustomOrder.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { sendCustomOrderEmail, sendCustomOrderStatusEmail } from '../utils/email.js';

export const createCustomOrder = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      productType,
      preferredColors,
      size,
      quantity,
      budget,
      requiredDate,
      referenceImages,
      specialInstructions
    } = req.body;

    const customOrder = await CustomOrder.create({
      user: req.user?.id,
      name,
      phone,
      email,
      productType,
      preferredColors: preferredColors || [],
      size,
      quantity: quantity || 1,
      budget,
      requiredDate: requiredDate ? new Date(requiredDate) : null,
      referenceImages: referenceImages || [],
      specialInstructions
    });

    // Notify admin (could send email/notification)
    await sendCustomOrderEmail(customOrder);

    res.status(201).json({
      success: true,
      message: 'Your custom order request has been received. We\'ll contact you shortly!',
      customOrder
    });
  } catch (error) {
    next(error);
  }
};

export const getMyCustomOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };

    const skip = (Number(page) - 1) * Number(limit);
    const customOrders = await CustomOrder.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await CustomOrder.countDocuments(query);

    res.status(200).json({
      success: true,
      customOrders,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomOrder = async (req, res, next) => {
  try {
    const customOrder = await CustomOrder.findById(req.params.id)
      .populate('user', 'name email phone');

    if (!customOrder) {
      return next(new AppError('Custom order not found', 404));
    }

    // Check authorization
    if (req.user.role !== 'admin' && customOrder.user._id.toString() !== req.user.id) {
      return next(new AppError('Not authorized', 403));
    }

    res.status(200).json({ success: true, customOrder });
  } catch (error) {
    next(error);
  }
};

export const updateCustomOrderStatus = async (req, res, next) => {
  try {
    const { status, note, quotation } = req.body;
    const customOrder = await CustomOrder.findById(req.params.id);

    if (!customOrder) {
      return next(new AppError('Custom order not found', 404));
    }

    const validStatuses = ['new', 'discussing', 'quoted', 'approved', 'in_production', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return next(new AppError('Invalid status', 400));
    }

    customOrder.status = status;
    if (note) customOrder.statusHistory.push({ status, note });
    if (quotation) customOrder.quotation = quotation;

    await customOrder.save();
    await customOrder.populate('user', 'name email');

    await sendCustomOrderStatusEmail(customOrder);

    res.status(200).json({ success: true, customOrder });
  } catch (error) {
    next(error);
  }
};

export const addAdminNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    const customOrder = await CustomOrder.findByIdAndUpdate(
      req.params.id,
      { adminNotes: note },
      { new: true }
    ).populate('user', 'name email');

    if (!customOrder) {
      return next(new AppError('Custom order not found', 404));
    }

    res.status(200).json({ success: true, customOrder });
  } catch (error) {
    next(error);
  }
};

export const deleteCustomOrder = async (req, res, next) => {
  try {
    const customOrder = await CustomOrder.findByIdAndDelete(req.params.id);
    if (!customOrder) {
      return next(new AppError('Custom order not found', 404));
    }
    res.status(200).json({ success: true, message: 'Custom order deleted' });
  } catch (error) {
    next(error);
  }
};