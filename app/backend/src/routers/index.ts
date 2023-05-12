import { Router } from 'express';

import teamRouter from './Team';
import errorHandler from '../middlewares/errorHandler';

const router = Router();

router.use('/teams', teamRouter);

router.use(errorHandler);

export default router;
