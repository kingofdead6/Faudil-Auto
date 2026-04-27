import express from 'express';
import multer from 'multer';
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getBrands,
  getYears,
} from '../Controllers/CarController.js';
// import { protect, admin } from '../middleware/authMiddleware.js'; // uncomment when auth is set up

const router = express.Router();

// Multer — store files in memory for Cloudinary upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// ─── Public routes ────────────────────────────────────────────────
router.get('/', getCars);
router.get('/brands', getBrands);
router.get('/years', getYears);
router.get('/:id', getCarById);

// ─── Admin / protected routes ─────────────────────────────────────
// Swap in `protect, admin,` middleware before the upload handler in production
router.post('/', /* protect, admin, */ upload.array('images', 20), createCar);
router.put('/:id', /* protect, admin, */ upload.array('images', 20), updateCar);
router.delete('/:id', /* protect, admin, */ deleteCar);

export default router;