import { Router } from 'express';
import { LemburController } from '../controllers/lembur.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.use(authenticate);

// Khusus Pegawai
router.post('/', authorize('pegawai'), LemburController.ajukanLembur);
router.get('/saya', authorize('pegawai'), LemburController.getLemburSaya);

// Khusus Admin
router.get('/', authorize('admin'), LemburController.getAllLembur);
router.post('/batch-approve', authorize('admin'), LemburController.batchApproveLembur);
router.put('/:id/approve', authorize('admin'), LemburController.approveLembur);

export default router;
