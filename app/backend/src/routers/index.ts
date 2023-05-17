import { Router } from 'express';

import teamRouter from './Team';
import loginRouter from './Login';
import matchRouter from './Match';
import leaderboardRouter from './Leaderboard';

import errorHandler from '../middlewares/errorHandler';

const router = Router();

router.use('/teams', teamRouter);
router.use('/login', loginRouter);
router.use('/matches', matchRouter);
router.use('/leaderboard', leaderboardRouter);

router.use(errorHandler);

export default router;
