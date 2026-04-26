import express from 'express';
import multer from 'multer';
import {
  getCarNames,
  getCarNameById,
  createCarName,
  updateCarName,
  deleteCarName,
} from '../controllers/carNameController.js';
// import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// ─── Public ───────────────────────────────────────────────────────
router.get('/', getCarNames);
router.get('/:id', getCarNameById);

// ─── Admin / protected ────────────────────────────────────────────
router.post('/',    /* protect, admin, */ upload.single('image'), createCarName);
router.put('/:id',  /* protect, admin, */ upload.single('image'), updateCarName);
router.delete('/:id', /* protect, admin, */ deleteCarName);

export default router;