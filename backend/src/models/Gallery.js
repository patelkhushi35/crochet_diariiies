import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  image: {
    url: String,
    publicId: String
  },
  alt: String,
  category: {
    type: String,
    enum: ['products', 'behind-the-scenes', 'work-in-progress', 'packaging', 'lifestyle', 'workshop']
  },
  caption: String,
  tags: [String],
  isInstagram: {
    type: Boolean,
    default: false
  },
  instagramUrl: String,
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Gallery', gallerySchema);