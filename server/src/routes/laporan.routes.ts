import { Router } from 'express';
import { LaporanController } from '../controllers/laporan.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/absensi', LaporanController.rekapAbsensi);
router.get('/penggajian', LaporanController.rekapPenggajian);
router.get('/pegawai', LaporanController.exportPegawai);

export default router;
