import { Response } from 'express';

export const errorUniqueCheck = ({ err, res }: { err: any; res: Response }) => {
  if (err.code === 11000) {
    const [[prop, value]] = Object.entries(err.keyValue);
    res.status(400).send({
      error: `${prop} ${value} already exists`,
    });
  }
};
