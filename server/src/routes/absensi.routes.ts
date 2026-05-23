import { Router } from 'express';
import { AbsensiController } from '../controllers/absensi.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

// Protect all routes with authentication
router.use(authenticate);

// === PEGAWAI ROUTES ===
router.post('/clock-in', authorize('pegawai'), AbsensiController.clockIn);
router.post('/clock-out', authorize('pegawai'), AbsensiController.clockOut);
router.get('/me', authorize('pegawai'), AbsensiController.getMyRiwayat);

// === ADMIN ROUTES ===
router.get('/rekap', authorize('admin'), AbsensiController.getRekap);
router.get('/statistik', authorize('admin'), AbsensiController.getStatistik);
router.post('/manual', authorize('admin'), AbsensiController.manualInput);
router.put('/validasi-massal', authorize('admin'), AbsensiController.validasiMassal);
router.put('/:id/validasi', authorize('admin'), AbsensiController.validasi);

export default router;
