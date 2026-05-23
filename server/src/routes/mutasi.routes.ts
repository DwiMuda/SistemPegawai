import { Router } from 'express';
import { MutasiController } from '../controllers/mutasi.controller';
import { validate } from '../middlewares/validate';
import { createMutasiSchema } from '../validators/mutasi.validator';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

// Semua rute mutasi butuh autentikasi
router.use(authenticate);

// Admin routes
router.get('/', authorize('admin'), MutasiController.getAll);
router.post('/', authorize('admin'), validate(createMutasiSchema), MutasiController.create);
router.get('/:id', authorize('admin'), MutasiController.getById);

// Pegawai route (to see their own history)
router.get('/pegawai/:idPegawai', authorize('pegawai', 'admin'), MutasiController.getByPegawai);

export default router;
