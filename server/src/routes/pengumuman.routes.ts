import { Router } from 'express';
import { pengumumanController } from '../controllers/pengumuman.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.use(authenticate);

// Public route for all logged-in users (Pegawai & Admin)
router.get('/active', pengumumanController.getActive);

// Admin only routes
router.use(authorize('admin'));
router.get('/', pengumumanController.getAll);
router.post('/', authorize('admin'), pengumumanController.create);
router.put('/:id', authorize('admin'), pengumumanController.update);
router.delete('/:id', authorize('admin'), pengumumanController.delete);

export default router;
