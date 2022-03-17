import { Request, Response, NextFunction } from 'express';

import { Competition } from '../models/index.js';

export const getCompetitions = async (req: Request, res: Response, next: NextFunction) => {
    const competions = await Competition.find({});

    res.send(competions);
  };
  
  export const getCompetition = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const competition = await Competition.findOne({ _id: id });

    res.send(competition);

  };
  
  export const createCompetition = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.sendStatus(400);
  
    const body = req.body;

    const competition = new Competition(body);
  
    await competition.save();

    res.send(competition);
  };
  
  export const deleteCompetition = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const competition = await Competition.findByIdAndDelete(id);

    res.send(competition);
  };
  
  export const updateCompetition = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.sendStatus(400);
    const { id } = req.body;
  
    const competition = await Competition.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true, rawResult: true },
    );

    res.send(competition);
  };
  