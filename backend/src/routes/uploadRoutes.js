import express from 'express';
import { upload } from '../utils/cloudinary.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/image', protect, authorize('admin'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const result = await uploadToCloudinary(req.file.buffer);
    res.status(200).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

router.post('/images', protect, authorize('admin'), upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const results = await Promise.all(
      req.files.map(file => uploadToCloudinary(file.buffer))
    );
    res.status(200).json({
      success: true,
      images: results.map(r => ({ url: r.secure_url, publicId: r.public_id }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

router.delete('/image/:publicId', protect, authorize('admin'), async (req, res) => {
  try {
    await deleteFromCloudinary(req.params.publicId);
    res.status(200).json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
});

export default router;