import { Request, Response, NextFunction } from 'express';

import { Pair } from '../models/index.js';

export const getPairs = async (req: Request, res: Response, next: NextFunction) => {
    const competions = await Pair.find({});

    res.send(competions);
  };
  
  export const getPair = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const pair = await Pair.findOne({ _id: id });

    res.send(pair);

  };
  
  export const createPair = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.sendStatus(400);
  
    const body = req.body;

    const pair = new Pair(body);
  
    await pair.save();

    res.send(pair);
  };
  
  export const deletePair = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const pair = await Pair.findByIdAndDelete(id);

    res.send(pair);
  };
  
  export const updatePair = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.sendStatus(400);
    const { id } = req.body;
  
    const pair = await Pair.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true, rawResult: true },
    );

    res.send(pair);
  };
  