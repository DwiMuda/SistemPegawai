import { Router } from 'express';
import { JabatanController } from '../controllers/jabatan.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { createJabatanSchema, updateJabatanSchema } from '../validators/jabatan.validator';
import { paginate } from '../middlewares/pagination';
import { auditLog } from '../middlewares/audit';

const router = Router();

router.use(authenticate);

router.get('/', paginate, JabatanController.list);
router.get('/all', JabatanController.getAll);
router.get('/:id', JabatanController.getById);
router.post('/', authorize('admin'), validate(createJabatanSchema), auditLog('CREATE', 'Jabatan'), JabatanController.create);
router.put('/:id', authorize('admin'), validate(updateJabatanSchema), auditLog('UPDATE', 'Jabatan'), JabatanController.update);
router.delete('/:id', authorize('admin'), auditLog('DELETE', 'Jabatan'), JabatanController.delete);

export default router;
