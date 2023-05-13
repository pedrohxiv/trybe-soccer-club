import { Router } from 'express';

import teamRouter from './Team';
import loginRouter from './Login';

import errorHandler from '../middlewares/errorHandler';

const router = Router();

router.use('/teams', teamRouter);
router.use('/login', loginRouter);

router.use(errorHandler);

export default router;
