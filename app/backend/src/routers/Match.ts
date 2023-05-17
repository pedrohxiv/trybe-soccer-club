import { Router } from 'express';

import * as matchController from '../controllers/Match';
import tokenValidation from '../middlewares/tokenValidation';

const router = Router();

router.get('/', matchController.getAll);
router.patch('/:id/finish', tokenValidation, matchController.finishMatch);
router.patch('/:id', tokenValidation, matchController.updateMatchInProgress);
router.post('/', tokenValidation, matchController.create);

export default router;
