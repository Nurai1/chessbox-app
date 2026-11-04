import { NextFunction, Request, Response } from 'express';

export const requireRole =
  (role: string) => (_req: Request, res: Response, next: NextFunction) => {
    if (res.locals.loggedInUser?.role !== role) {
      return res
        .status(403)
        .send({ error: 'This action is not allowed for your role.' });
    }
    return next();
  };
