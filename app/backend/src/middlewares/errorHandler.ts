import { NextFunction, Request, Response } from 'express';

export default function errorHandler(
  error: { status: number; message: string },
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error.status) {
    return res.status(error.status).json({ message: error.message });
  }
  return res.status(500).json({ message: error.message });
}
