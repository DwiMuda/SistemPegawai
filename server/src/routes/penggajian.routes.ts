import { Router } from 'express';
import { PenggajianController } from '../controllers/penggajian.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { bayarGajiSchema, bayarMassalSchema } from '../validators/penggajian.validator';

const router = Router();

// Semua rute perlu autentikasi
router.use(authenticate);

// Endpoint untuk diakses oleh Pegawai (dan Admin)
router.get('/:id/pdf', authorize('pegawai', 'admin'), PenggajianController.downloadPdf);
router.get('/:id', authorize('pegawai', 'admin'), PenggajianController.getById);
// Untuk list punya pegawai sendiri, bisa menggunakan get dengan query params idPegawai
// karena controller getAll belum me-restrict akses jika role=pegawai, kita buat restriction di controller
// namun karena di rute kita membedakan logic, mari buat rute khusus me
// Ah, the user didn't specify '/me' but instead using /api/v1/penggajian directly.
// We will let the frontend use standard '/penggajian?idPegawai=X' or similar, but
// let's just expose getAll to admin for now. Wait, user can see their list of slips in SlipGajiPage.
router.get('/', authorize('pegawai', 'admin'), PenggajianController.getAll);

// Endpoint Khusus Admin
router.post('/generate', authorize('admin'), PenggajianController.generate);
router.get('/export/excel', authorize('admin'), PenggajianController.downloadExcel);
router.put('/bayar-massal', authorize('admin'), validate(bayarMassalSchema), PenggajianController.bayarMassal);
router.put('/:id', authorize('admin'), PenggajianController.updateKomponen);
router.put('/:id/bayar', authorize('admin'), validate(bayarGajiSchema), PenggajianController.bayarGaji);
router.put('/:id/batal', authorize('admin'), PenggajianController.batalBayar);

export default router;
