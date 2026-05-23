import { Router } from 'express';
import { CutiController } from '../controllers/cuti.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

// Semua route cuti butuh autentikasi
router.use(authenticate);

// Route untuk Pegawai
router.post('/', authorize('pegawai', 'admin'), CutiController.createPengajuan);
router.get('/me', authorize('pegawai', 'admin'), CutiController.getMyCuti);
router.put('/:id/batal', authorize('pegawai', 'admin'), CutiController.batalCuti);

// Route untuk Admin
router.get('/', authorize('admin'), CutiController.getAllCuti);
router.post('/reset-tahunan', authorize('admin'), CutiController.resetTahunan);
router.put('/:id/approve', authorize('admin'), CutiController.approveCuti);

export default router;
