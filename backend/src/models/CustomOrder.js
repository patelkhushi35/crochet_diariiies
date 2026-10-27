import mongoose from 'mongoose';

const customOrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  productType: {
    type: String,
    required: true
  },
  preferredColors: [String],
  size: String,
  quantity: {
    type: Number,
    default: 1
  },
  budget: Number,
  requiredDate: Date,
  referenceImages: [{
    url: String,
    publicId: String
  }],
  specialInstructions: String,
  status: {
    type: String,
    enum: ['new', 'discussing', 'quoted', 'approved', 'in_production', 'completed', 'cancelled'],
    default: 'new'
  },
  quotation: {
    amount: Number,
    details: String,
    validUntil: Date
  },
  adminNotes: String,
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('CustomOrder', customOrderSchema);