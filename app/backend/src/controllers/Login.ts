import { NextFunction, Request, Response } from 'express';

import * as loginService from '../services/Login';

export async function signin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const login = await loginService.signin(email, password);

    return res.status(200).json(login);
  } catch (error) {
    next(error);
  }
}

export async function getRole(req: Request, res: Response, next: NextFunction) {
  try {
    const { authorization: token } = req.headers;

    const role = await loginService.getRole(token ?? '');

    return res.status(200).json(role);
  } catch (error) {
    next(error);
  }
}
