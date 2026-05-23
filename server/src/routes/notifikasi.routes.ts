import { Router } from 'express';
import { NotifikasiController } from '../controllers/notifikasi.controller';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

// Semua rute notifikasi butuh autentikasi
router.use(authenticate);

router.get('/', NotifikasiController.getMyNotifications);
router.get('/count', NotifikasiController.getUnreadCount);
router.put('/read-all', NotifikasiController.markAllAsRead);
router.put('/:id/read', NotifikasiController.markAsRead);

export default router;
