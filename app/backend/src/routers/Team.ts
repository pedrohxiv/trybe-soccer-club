import { Router } from 'express';

import * as teamController from '../controllers/Team';

const router = Router();

router.get('/', teamController.getAll);
router.get('/:id', teamController.getById);

export default router;
