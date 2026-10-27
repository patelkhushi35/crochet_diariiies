import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  image: String,
  price: Number,
  quantity: Number,
  selectedColor: String,
  selectedSize: String
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  street: String,
  city: String,
  state: String,
  pincode: String,
  landmark: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'netbanking', 'cod', 'razorpay'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'ready_to_ship', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  subtotal: Number,
  shipping: Number,
  tax: Number,
  total: Number,
  deliveryInstructions: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  trackingNumber: String,
  courier: String
}, {
  timestamps: true
});

orderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    this.orderNumber = 'CD' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

export default mongoose.model('Order', orderSchema);