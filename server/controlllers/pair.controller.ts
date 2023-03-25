// import { Request, Response, NextFunction } from 'express';

// import { Competition, Pair, User } from '../models/index.js';
// import { recalculateRating } from '../utils/recalculateRating.js';

// export const getPairs = async (req: Request, res: Response) => {
//   const competions = await Pair.find({});

//   res.send(competions);
// };

// export const getPair = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   const pair = await Pair.findOne({ _id: id });

//   res.send(pair);
// };

// export const createPair = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (!req.body) return res.sendStatus(400);
//   // todo: NOT CORRECT
//   const { competition, blackParticipant, whiteParticipant } = req.body;

//   const competitionEntityPromise = Competition.findOne({
//     _id: competition,
//   }).populate({
//     path: 'participants',
//     match: { _id: { $in: [blackParticipant, whiteParticipant] } },
//   });

//   const blackParticipantEntityPromise = User.findOne({
//     _id: blackParticipant,
//   }).populate({
//     path: 'pair',
//   });

//   const whiteParticipantEntityPromise = User.findOne({
//     _id: whiteParticipant,
//   }).populate({
//     path: 'pair',
//   });

//   const [competitionEntity, blackParticipantEntity, whiteParticipantEntity] =
//     await Promise.all([
//       competitionEntityPromise,
//       blackParticipantEntityPromise,
//       whiteParticipantEntityPromise,
//     ]);

//   if (
//     !blackParticipantEntity ||
//     !whiteParticipantEntity ||
//     !competitionEntity
//   ) {
//     res.status(400).send({
//       error: {
//         message: "Some entities wasn't found.",
//       },
//     });
//     return;
//   }

//   if (blackParticipantEntity?.pair || whiteParticipantEntity?.pair) {
//     res.status(400).send({
//       error: {
//         message: 'Data Error: One or both of participants already has a pair.',
//       },
//     });
//   }

//   // if ((competitionEntity?.participants?.length ?? 0) < 2) {
//   //   res.status(400).send({
//   //     error: {
//   //       message:
//   //         "Data Error: Competition don't have participants provided in pair.",
//   //     },
//   //   });
//   // }

//   const pair = new Pair(req.body);

//   // competitionEntity?.pairs.push(pair);
//   whiteParticipantEntity.pair = pair;
//   blackParticipantEntity.pair = pair;

//   await Promise.allSettled([
//     pair.save(),
//     competitionEntity?.save(),
//     whiteParticipantEntity?.save(),
//     blackParticipantEntity?.save(),
//   ]);

//   res.send(pair);
// };

// export const deletePair = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   const pair = await Pair.findByIdAndDelete(id);

//   res.send(pair);
// };

// export const updatePair = async (req: Request, res: Response) => {
//   if (!req.body) return res.sendStatus(400);
//   const { id } = req.body;

//   const pair = await Pair.findOneAndUpdate({ _id: id }, req.body, {
//     new: true,
//   });

//   res.send(pair);
// };

// export const defineWinner = async (req: Request, res: Response) => {
//   if (!req.body) return res.sendStatus(400);
//   const { pairId, winnerId } = req.body;

//   const pair = await Pair.findOne({ _id: pairId })
//     .populate('blackParticipant')
//     .populate('whiteParticipant');

//   const isBlackParticipantWin = pair?.blackParticipant?._id === winnerId;
//   const winner = isBlackParticipantWin
//     ? pair?.blackParticipant
//     : pair?.whiteParticipant;
//   const loser = !isBlackParticipantWin
//     ? pair?.blackParticipant
//     : pair?.whiteParticipant;

//   const { newWinnerRating, newLoserRating } = recalculateRating(
//     winner.ratingNumber,
//     loser.ratingNumber
//   );
//   winner.ratingNumber = newWinnerRating;
//   loser.ratingNumber = newLoserRating;

//   await Promise.allSettled([
//     User.findOneAndUpdate(
//       winner._id,
//       { ratingNumber: newWinnerRating },
//       { new: true }
//     ),
//     User.findOneAndUpdate(
//       { _id: loser._id },
//       { ratingNumber: newLoserRating },
//       { new: true }
//     ),
//   ]);

//   res.send({
//     pairId,
//     blackParticipant: isBlackParticipantWin ? winner : loser,
//     whiteParticipant: !isBlackParticipantWin ? winner : loser,
//   });
// };
