import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { AppError } from '../middleware/errorHandler.js';
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '../utils/email.js';
import { razorpay } from '../utils/razorpay.js';

export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      deliveryInstructions
    } = req.body;

    if (!items || items.length === 0) {
      return next(new AppError('No items in order', 400));
    }

    if (paymentMethod !== 'cod' && !razorpay) {
      return next(new AppError('Online payment is not configured', 503));
    }

    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return next(new AppError(`Product not found: ${item.productId}`, 404));
      }

      if (product.stock < item.quantity) {
        return next(new AppError(`Insufficient stock for ${product.name}`, 400));
      }

      const price = product.price;
      subtotal += price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url,
        price,
        quantity: item.quantity,
        selectedColor: item.color,
        selectedSize: item.size
      });

      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }

    const shipping = subtotal > 999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      deliveryInstructions,
      subtotal,
      shipping,
      tax,
      total,
      statusHistory: [{ status: 'pending', note: 'Order placed' }]
    });

    // Create Razorpay order if online payment
    let razorpayOrder = null;
    if (paymentMethod !== 'cod') {
      razorpayOrder = await razorpay.orders.create({
        amount: total * 100,
        currency: 'INR',
        receipt: order.orderNumber
      });
      order.paymentId = razorpayOrder.id;
      await order.save();
    }

    // Send confirmation email
    await sendOrderConfirmationEmail(req.user.email, order);

    res.status(201).json({
      success: true,
      order,
      razorpayOrder
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { user: req.user.id };
    if (status) query.orderStatus = status;

    const skip = (Number(page) - 1) * Number(limit);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      $or: [
        { _id: req.params.id },
        { orderNumber: req.params.id }
      ],
      user: req.user.id
    }).lean();

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const order = await Order.findOne({ paymentId: razorpay_order_id }).populate('user', 'email');
    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    // Verify signature (implement proper verification)
    const crypto = await import('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return next(new AppError('Invalid payment signature', 400));
    }

    order.paymentStatus = 'paid';
    order.paymentId = razorpay_payment_id;
    order.orderStatus = 'confirmed';
    order.statusHistory.push({ status: 'confirmed', note: 'Payment verified' });
    await order.save();

    await sendOrderStatusEmail(order.user.email, order);

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return next(new AppError('Cannot cancel order at this stage', 400));
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    order.orderStatus = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', note: 'Cancelled by customer' });
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// Admin controllers
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};

    if (status) query.orderStatus = status;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.name': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note, trackingNumber, courier } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'ready_to_ship', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return next(new AppError('Invalid status', 400));
    }

    order.orderStatus = status;
    if (note) order.statusHistory.push({ status, note });
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (courier) order.courier = courier;
    if (status === 'delivered') order.deliveredAt = new Date();

    await order.save();
    await order.populate('user', 'name email');

    await sendOrderStatusEmail(order.user.email, order);

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const getOrderStats = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.status(200).json({
      success: true,
      stats,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    next(error);
  }
};