import { Router } from 'express';

import * as loginController from '../controllers/Login';
import tokenValidation from '../middlewares/tokenValidation';

const router = Router();

router.post('/', loginController.signin);
router.get('/role', tokenValidation, loginController.getRole);

export default router;
