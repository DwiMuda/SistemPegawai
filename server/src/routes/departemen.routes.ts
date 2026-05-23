import { Router } from 'express';
import { DepartemenController } from '../controllers/departemen.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { createDepartemenSchema, updateDepartemenSchema } from '../validators/departemen.validator';
import { paginate } from '../middlewares/pagination';
import { auditLog } from '../middlewares/audit';

const router = Router();

router.use(authenticate);

router.get('/', paginate, DepartemenController.list);
router.get('/all', DepartemenController.getAll);
router.get('/:id', DepartemenController.getById);
router.post('/', authorize('admin'), validate(createDepartemenSchema), auditLog('CREATE', 'Departemen'), DepartemenController.create);
router.put('/:id', authorize('admin'), validate(updateDepartemenSchema), auditLog('UPDATE', 'Departemen'), DepartemenController.update);
router.delete('/:id', authorize('admin'), auditLog('DELETE', 'Departemen'), DepartemenController.delete);

export default router;
