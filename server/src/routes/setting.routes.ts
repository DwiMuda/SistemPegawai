import { Router } from 'express';
import { SettingController } from '../controllers/setting.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/', SettingController.getAll);
router.put('/:key', SettingController.update);

export default router;
