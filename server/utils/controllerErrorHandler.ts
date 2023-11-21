import { Request, Response, NextFunction } from 'express';

export const controllerErrorHandler =
  (controllerExecutor: Function) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controllerExecutor(req, res, next);
    } catch (err: any) {
      console.error(err);
      next(err);
    }
  };
