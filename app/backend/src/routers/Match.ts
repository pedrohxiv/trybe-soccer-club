import { Router } from 'express';

import * as matchController from '../controllers/Match';

const router = Router();

router.get('/', matchController.getAll);

export default router;
