// import { Request, Response, NextFunction } from 'express';

// import { CompetitionGroup } from '../models/index.js';
// import { ICompetitionGroup, IPair } from '../types/index.js';
// import { getParticipantsAmountForFirstRound } from '../utils/getParticipantsAmountForFirstRound.js';

// export const getCompetitionGroups = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const competions = await CompetitionGroup.find({})
//     .populate('allParticipants')
//     .populate('nextRoundParticipants');

//   res.send(competions);
// };

// export const getCompetitionGroup = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id } = req.params;

//   const competition = await CompetitionGroup.findOne({ _id: id });

//   res.send(competition);
// };

// export const createCompetitionGroup = async (
//   req: Request<{}, any, ICompetitionGroup>,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (!req.body) return res.sendStatus(400);

//   const { body } = req;
//   const { allParticipants } = body;
//   const firstRoundPairs: IPair[] = [];
//   const participantsAmountForFirstRound = getParticipantsAmountForFirstRound(
//     allParticipants.length
//   );

//   const shuffledParticipants = allParticipants.sort(() => Math.random() - 0.5);

//   for (let i = 0; i < participantsAmountForFirstRound; i += 2) {
//     firstRoundPairs.push({
//       roundNumber: 1,
//       blackParticipant: shuffledParticipants[i + 1],
//       whiteParticipant: shuffledParticipants[i],
//     });
//   }

//   const group: ICompetitionGroup = {
//     ...body,
//     pairs: firstRoundPairs,
//     currentRoundNumber: 1,
//     nextRoundParticipants: shuffledParticipants.slice(
//       participantsAmountForFirstRound
//     ),
//   };

//   const competition = new CompetitionGroup(group);

//   await competition.save();

//   res.send(competition);
// };

// export const deleteCompetitionGroup = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id } = req.params;

//   const competition = await CompetitionGroup.findByIdAndDelete(id);

//   res.send(competition);
// };

// export const updateCompetitionGroup = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (!req.body) return res.sendStatus(400);
//   const { id } = req.body;

//   const competition = await CompetitionGroup.findOneAndUpdate(
//     { _id: id },
//     req.body,
//     { new: true }
//   );

//   res.send(competition);
// };
