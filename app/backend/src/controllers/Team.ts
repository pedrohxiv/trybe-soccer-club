import { NextFunction, Request, Response } from 'express';

import * as teamService from '../services/Team';

export async function getAll(_req: Request, res: Response, next: NextFunction) {
  try {
    const teams = await teamService.getAll();

    return res.status(200).json(teams);
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const team = await teamService.getById(+id);

    return res.status(200).json(team);
  } catch (error) {
    next(error);
  }
}
