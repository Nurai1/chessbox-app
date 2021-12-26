import { Request, Response, NextFunction } from 'express';

export const controllerErrorHandler =
  (controllerExecutor: any) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      controllerExecutor(req, res, next);
    } catch (err: any) {
      next();
    }
  };
