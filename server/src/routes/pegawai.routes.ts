import { Router } from 'express';
import { PegawaiController } from '../controllers/pegawai.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

// Protect all routes with authentication
router.use(authenticate);

// Get all for dropdowns etc
router.get('/all', authorize('admin'), PegawaiController.getAll);

// CRUD routes
router.get('/', authorize('admin'), PegawaiController.list);
router.post('/', authorize('admin'), PegawaiController.create);
router.get('/:id', authorize('admin'), PegawaiController.getById);
router.put('/:id', authorize('admin'), PegawaiController.update);
router.delete('/:id', authorize('admin'), PegawaiController.delete);

export default router;
