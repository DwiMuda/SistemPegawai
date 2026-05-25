import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { reimbursementController } from '../controllers/reimbursement.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

router.use(authenticate);

// Pegawai routes
router.get('/me', reimbursementController.getMyReimbursement);
router.post('/', upload.single('buktiFile'), reimbursementController.create);

// Admin routes
router.get('/', authorize('admin'), reimbursementController.getAll);
router.put('/:id/approve', authorize('admin'), reimbursementController.approve);
router.put('/:id/reject', authorize('admin'), reimbursementController.reject);

export default router;
