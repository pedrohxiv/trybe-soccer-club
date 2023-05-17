import { NextFunction, Request, Response } from 'express';

import * as matchService from '../services/Match';

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { inProgress } = req.query;

    const matches = await matchService.getAll(inProgress as string);

    return res.status(200).json(matches);
  } catch (error) {
    next(error);
  }
}

export async function finishMatch(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const finishedMatch = await matchService.finishMatch(+id);

    return res.status(200).json(finishedMatch);
  } catch (error) {
    next(error);
  }
}

export async function updateMatchInProgress(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;

    await matchService.updateMatchInProgress(+id, +homeTeamGoals, +awayTeamGoals);

    return res.status(200).end();
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;

    const newMatch = await matchService.create(
      +homeTeamId,
      +awayTeamId,
      +homeTeamGoals,
      +awayTeamGoals,
    );

    return res.status(201).json(newMatch);
  } catch (error) {
    next(error);
  }
}
