import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.use(authenticate);

router.get('/pegawai', authorize('pegawai'), DashboardController.getPegawaiDashboard);
router.get('/admin', authorize('admin'), DashboardController.getAdminDashboard);

export default router;
