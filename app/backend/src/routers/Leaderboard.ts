import { Router } from 'express';

import * as leaderboardController from '../controllers/Leaderboard';

const router = Router();

router.get('/home', leaderboardController.getAllHomeRanking);
router.get('/away', leaderboardController.getAllAwayRanking);
router.get('/', leaderboardController.getAllTotalRanking);

export default router;
