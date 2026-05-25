import { Router } from 'express';
import authRoutes from './auth.routes';
import jabatanRoutes from './jabatan.routes';
import departemenRoutes from './departemen.routes';
import pegawaiRoutes from './pegawai.routes';
import absensiRoutes from './absensi.routes';
import cutiRoutes from './cuti.routes';
import penggajianRoutes from './penggajian.routes';
import lemburRoutes from './lembur.routes';
import dashboardRoutes from './dashboard.routes';
import laporanRoutes from './laporan.routes';
import settingRoutes from './setting.routes';
import mutasiRoutes from './mutasi.routes';
import notifikasiRoutes from './notifikasi.routes';
import pengumumanRoutes from './pengumuman.routes';
import kasbonRoutes from './kasbon.routes';
import reimbursementRoutes from './reimbursement.routes';

const router = Router();

// Mount all routes
router.use('/auth', authRoutes);
router.use('/jabatan', jabatanRoutes);
router.use('/departemen', departemenRoutes);
router.use('/pegawai', pegawaiRoutes);
router.use('/absensi', absensiRoutes);
router.use('/cuti', cutiRoutes);
router.use('/penggajian', penggajianRoutes);
router.use('/lembur', lemburRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/laporan', laporanRoutes);
router.use('/setting', settingRoutes);
router.use('/mutasi', mutasiRoutes);
router.use('/notifikasi', notifikasiRoutes);
router.use('/pengumuman', pengumumanRoutes);
router.use('/kasbon', kasbonRoutes);
router.use('/reimbursement', reimbursementRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
