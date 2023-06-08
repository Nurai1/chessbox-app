import { NextFunction, Request, Response } from 'express';

import { Competition, User } from '../models/index';
import { ICompetitionGroup, IPair } from '../types/index';
import { getParticipantsAmountForFirstRound } from '../utils/getParticipantsAmountForFirstRound';
import { recalculateRating } from '../utils/recalculateRating';
import { getPairsWithJudges } from '../utils/competition';

export const getCompetitions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const competions = await Competition.find({});

  res.send(competions);
};

export const getCompetition = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const competition = await Competition.findOne({ _id: id });

  res.send(competition);
};

export const createCompetition = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body) return res.sendStatus(400);

  const { body } = req;

  const competition = new Competition(body);

  await competition.save();

  res.send(competition);
};

export const setJudgesToCompetition = async (
  req: Request<any, any, { judgesIds: string[]; competitionId: string }>,
  res: Response,
  next: NextFunction
) => {
  if (!req.body) return res.sendStatus(400);

  const {
    body: { judgesIds, competitionId },
  } = req;

  if (judgesIds.length < 1) {
    res.status(500).send({ error: 'Judges must be more than 0.' });
  }

  const competition = await Competition.findById(competitionId);
  if (competition) {
    competition.judges = await Promise.all(
      judgesIds.map((judgeId) => User.findById(judgeId))
    );

    await competition.save();
    res.send(competition);
  }
  res.status(500).send({ error: 'No competition found.' });
};

export const startCompetition = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const { params } = req;
  if (!params.id) return res.sendStatus(400);

  const competition = await Competition.findById(params.id)
    .populate('participants')
    .populate('judges');

  const participantsAmount = competition?.participants.length;
  if (competition) {
    if (!competition?.judges) {
      res.status(500).send({ error: 'No judges in competition.' });
    }

    if (!competition.groups) {
      res.status(500).send({ error: 'No groups in competition.' });
    }

    const orderedGroups = competition.groups.sort((a, b) => {
      // always true on that stage
      if (a.order && b.order) {
        return a.order - b.order;
      }
      return 0;
    });

    competition.groups = orderedGroups;
    competition.participantsAmount = participantsAmount;
    await competition?.save();

    res.sendStatus(200);
  }
  res.status(500).send({ error: 'No competition with this id.' });
};

export const deleteCompetition = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const competition = await Competition.findByIdAndDelete(id);

  res.send(competition);
};

export const updateCompetition = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body) return res.sendStatus(400);
  const { id } = req.params;

  const competition = await Competition.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  );

  res.send(competition);
};

export const createCompetitionGroup = async (
  req: Request<{ id: string }, any, ICompetitionGroup>,
  res: Response,
  next: NextFunction
) => {
  if (!req.body) return res.sendStatus(400);

  const { body } = req;
  const { params } = req;

  const competition = await Competition.findById(params.id);

  const { allParticipants } = body;
  const firstRoundPairs: IPair[] = [];
  const participantsAmountForFirstRound = getParticipantsAmountForFirstRound(
    allParticipants.length
  );

  const shuffledParticipants = allParticipants.sort(() => Math.random() - 0.5);

  for (let i = 0; i < participantsAmountForFirstRound; i += 2) {
    firstRoundPairs.push({
      roundNumber: 1,
      blackParticipant: shuffledParticipants[i + 1],
      whiteParticipant: shuffledParticipants[i],
      passed: false,
    });
  }

  if (competition) {
    const group: ICompetitionGroup = {
      ...body,
      currentRoundPairs: firstRoundPairs,
      currentRoundNumber: 1,
      nextRoundParticipants: shuffledParticipants.slice(
        participantsAmountForFirstRound
      ),
    };

    const groupWithJudges = {
      ...group,
      currentRoundPairs: getPairsWithJudges({
        pairs: firstRoundPairs,
        judges: competition?.judges,
      }),
    };

    competition.groups = [groupWithJudges, ...competition.groups];

    await competition.save();

    const groupId = competition.groups[0]._id;

    await User.updateMany(
      { _id: { $in: allParticipants.map((p) => p._id) } },
      { currentGroupId: groupId }
    );
  }

  res.send(competition);
};

export const getCompetitionGroups = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  if (!req.params?.id) return res.sendStatus(400);

  const competition = await Competition.findById(req.params.id);

  res.send(competition?.groups);
};

export const addNewParticipant = async (
  req: Request<{ id: string }, any, { userId: string }>,
  res: Response,
  next: NextFunction
) => {
  if (!req.body?.userId && !req.params?.id) return res.sendStatus(400);
  const { userId } = req.body;

  const competition = await Competition.findOne({ _id: req.params.id });
  const user = await User.findOne({ _id: userId });

  if (competition && user) {
    user.competition = competition;
    user.save();

    competition.participants = [...competition.participants, user];
    await competition.save();
  }
  res.send(competition);
};

export const callPairPreparation = async (
  req: Request<
    any,
    any,
    { competitionId: string; groupId: string; pairId: string }
  >,
  res: Response
) => {
  const { competitionId, groupId, pairId } = req.body;
  const competition = await Competition.findById(competitionId);
  const newGroups = competition?.groups.map((group) => {
    if (group._id?.toString() === groupId) {
      return {
        ...group,
        currentRoundPairs: group.currentRoundPairs.map((pair) => {
          if (pair._id?.toString() === pairId) {
            return {
              ...pair,
              calledForPreparation: true,
            };
          }
          return pair;
        }),
      };
    }
    return group;
  });
  if (competition && newGroups) {
    competition.groups = newGroups;

    const newCompetition = await Competition.findByIdAndUpdate(
      competitionId,
      competition,
      { new: true }
    );
    res.status(200).send(newCompetition);
  }

  res.sendStatus(500);
};

export const callPairFight = async (
  req: Request<
    any,
    any,
    { competitionId: string; groupId: string; pairId: string }
  >,
  res: Response
) => {
  const { competitionId, groupId, pairId } = req.body;
  const competition = await Competition.findById(competitionId);
  const newGroups = competition?.groups.map((group) => {
    if (group._id?.toString() === groupId) {
      return {
        ...group,
        pairs: group.currentRoundPairs.map((pair) => {
          if (pair._id?.toString() === pairId) {
            return {
              ...pair,
              calledForFight: true,
            };
          }
          return pair;
        }),
      };
    }
    return group;
  });
  if (competition && newGroups) {
    competition.groups = newGroups;

    const newCompetition = await Competition.findByIdAndUpdate(
      competitionId,
      competition,
      { new: true }
    );
    res.status(200).send(newCompetition);
  }

  res.sendStatus(500);
};

export const setNextCompetitionGroupOrder = async (
  req: Request<any, any, { competitionId: string; groupId: string }>,
  res: Response
) => {
  const { competitionId, groupId } = req.body;

  const competition = await Competition.findById(competitionId);
  const group = competition?.groups.find((g) => g._id?.toString() === groupId);
  const currentRoundPairs = group?.currentRoundPairs;

  if (competition && group && currentRoundPairs) {
    competition.lastOrder.group += 1;

    let currentLastPairOrder = competition.lastOrder.pair;

    const currentRoundPairsWithOrder = currentRoundPairs.map((p) => ({
      ...p,
      order: currentLastPairOrder++,
    }));

    competition.lastOrder.pair = currentLastPairOrder;

    const newGroups = competition?.groups.map((g) => {
      if (g._id?.toString() === groupId) {
        return { ...group, currentRoundPairs: currentRoundPairsWithOrder };
      }
      return g;
    });
    competition.groups = newGroups;
    await competition?.save();

    res.sendStatus(200);
  }

  res.sendStatus(500);
};

export const defineWinner = async (
  req: Request<
    any,
    any,
    {
      competitionId: string;
      groupId: string;
      pairId: string;
      winnerId: string;
      loserId: string;
    }
  >,
  res: Response
) => {
  if (!req.body) return res.sendStatus(400);
  const { pairId, winnerId, loserId, competitionId, groupId } = req.body;

  const competition = await Competition.findOne({
    _id: competitionId,
  }).populate({
    path: 'groups',
    populate: 'nextRoundParticipants',
  });

  const competitionGroup = competition?.groups.find(
    (group) => group._id?.toString() === groupId
  );

  if (!competitionGroup) {
    return res.status(400).send({ error: "Winner or loser don't exist" });
  }

  const [winner, loser] = await Promise.all([
    User.findById(winnerId),
    User.findById(loserId),
  ]);

  competitionGroup.nextRoundParticipants = [
    ...competitionGroup.nextRoundParticipants,
    winner,
  ];

  const passedPair = competitionGroup.currentRoundPairs.find(
    (pair) => pair._id?.toString() === pairId
  );

  if (!passedPair) {
    res.sendStatus(500);
    return;
  }

  competitionGroup.passedPairs = [
    ...(competitionGroup.passedPairs ?? []),
    { ...passedPair, passed: true, winner },
  ];

  if (winner && loser) {
    const { newWinnerRating, newLoserRating } = recalculateRating(
      winner.ratingNumber,
      loser.ratingNumber
    );

    const loserPlaceNumber =
      competitionGroup.allParticipants.length -
      (competitionGroup.passedPairs.length + 1);

    await Promise.all([
      User.findOneAndUpdate(
        { _id: winnerId },
        {
          ratingNumber: newWinnerRating,
          ...(loserPlaceNumber === 2
            ? {
                competitionsHistory: [
                  ...winner.competitionsHistory,
                  {
                    competitionId,
                    groupId,
                    placeNumber: 1,
                  },
                ],
              }
            : {}),
        },
        { new: true }
      ),
      User.findOneAndUpdate(
        { _id: loserId },
        {
          ratingNumber: newLoserRating,
          competitionsHistory: [
            ...loser.competitionsHistory,
            {
              competitionId,
              groupId,
              placeNumber:
                competitionGroup.allParticipants.length -
                (competitionGroup.passedPairs.length + 1),
            },
          ],
        },
        { new: true }
      ),
      competition?.save(),
    ]);

    res.sendStatus(200);
  }

  res.status(400).send({ error: "Winner or loser don't exist" });
};

export const launchNextGroupRound = async (
  req: Request<
    any,
    any,
    {
      competitionId: string;
      groupId: string;
    }
  >,
  res: Response
) => {
  if (!req.body) return res.sendStatus(400);
  const { competitionId, groupId } = req.body;

  const competition = await Competition.findOne({
    _id: competitionId,
  }).populate({
    path: 'groups',
    populate: 'nextRoundParticipants',
  });
  const competitionGroup = competition?.groups.find(
    (group) => group._id?.toString() === groupId
  );

  const nextRoundPairs = [];

  if (
    competition?.groups &&
    competitionGroup?.nextRoundParticipants &&
    competitionGroup?.currentRoundPairs
  ) {
    const nextRoundNumber =
      (competitionGroup?.currentRoundPairs[0]?.roundNumber ?? 0) + 1;

    for (let i = 0; i < competitionGroup.nextRoundParticipants.length; i += 2) {
      nextRoundPairs.push({
        roundNumber: nextRoundNumber,
        blackParticipant: competitionGroup.nextRoundParticipants[i + 1],
        whiteParticipant: competitionGroup.nextRoundParticipants[i],
        passed: false,
      });
    }

    competitionGroup.nextRoundParticipants = [];
    competitionGroup.currentRoundPairs = nextRoundPairs;

    competition.groups = competition?.groups.map((group) => {
      if (group._id?.toString() === groupId) {
        return competitionGroup;
      }
      return group;
    });

    await competition.save();

    res.sendStatus(200);
  }

  return res
    .status(400)
    .send({ error: 'No groups or nextRoundParticipants or pairs' });
};
