import { NextFunction, Request, Response } from 'express';

import * as leaderboardService from '../services/Leaderboard';

export async function getAllHomeRanking(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const homeRanking = await leaderboardService.getAllHomeRanking();

    return res.status(200).json(homeRanking);
  } catch (error) {
    next(error);
  }
}

export async function getAllAwayRanking(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const awayRanking = await leaderboardService.getAllAwayRanking();

    return res.status(200).json(awayRanking);
  } catch (error) {
    next(error);
  }
}

export async function getAllTotalRanking(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const totalRanking = await leaderboardService.getAllTotalRanking();

    return res.status(200).json(totalRanking);
  } catch (error) {
    next(error);
  }
}
