import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import httpErrorGenerator from '../utils/httpErrorGenerator';

export default function tokenValidation(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { authorization: token } = req.headers;
  if (!token) {
    throw httpErrorGenerator(401, 'Token not found');
  }
  try {
    verify(token, process.env.JWT_SECRET || 'jwt_secret');
  } catch (error) {
    throw httpErrorGenerator(401, 'Token must be a valid token');
  }
  next();
}
