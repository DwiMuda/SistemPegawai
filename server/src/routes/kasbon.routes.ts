import { Router } from 'express';
import { kasbonController } from '../controllers/kasbon.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.use(authenticate);

// Pegawai routes
router.get('/me', kasbonController.getMyKasbon);
router.post('/', kasbonController.create);

// Admin routes
router.get('/', authorize('admin'), kasbonController.getAll);
router.put('/:id/approve', authorize('admin'), kasbonController.approve);
router.put('/:id/reject', authorize('admin'), kasbonController.reject);

export default router;
