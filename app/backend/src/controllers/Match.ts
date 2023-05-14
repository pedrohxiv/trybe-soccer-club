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

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const match = await matchService.getById(+id);

    return res.status(200).json(match);
  } catch (error) {
    next(error);
  }
}
