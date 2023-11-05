import { NextFunction, Request, Response } from 'express';

import { Competition, User } from '../models/index';
import { ICompetition, ICompetitionGroup, IPair } from '../types/index';
import { getParticipantsAmountForCurrentRound } from '../utils/getParticipantsAmountForCurrentRound';
import {
  FIXED_RATING_CHANGING_NUM,
  recalculateRating,
} from '../utils/recalculateRating';
import { getPairsWithJudges } from '../utils/competition';

export const getCompetitions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const competitions = await Competition.find({});

  res.send(competitions);
};

export const getCompetition = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const competition = await Competition.findOne({ _id: id });
  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

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
  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

  competition.judges = await Promise.all(
    judgesIds.map((judgeId) => User.findById(judgeId))
  );

  await competition.save();
  competition.judges = judgesIds;

  res.send(competition);
};

export const setJudgesToPairs = async (
  req: Request<
    any,
    any,
    {
      judgesByGroups: {
        id: string;
        pairs: { id: string; judgeId: string }[];
      }[];
      competitionId: string;
    }
  >,
  res: Response
) => {
  if (!req.body) return res.sendStatus(400);

  const {
    body: { judgesByGroups, competitionId },
  } = req;

  const competition = await Competition.findById(competitionId).populate(
    'judges'
  );
  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });
  const judgesByIds = competition.judges.reduce(
    (acc, judge) => ({ ...acc, [judge._id?.toString()]: judge }),
    {}
  );

  const newGroups = competition.groups?.map((group) => {
    const judgesGroup = judgesByGroups.find(
      (g) => g.id === group._id?.toString()
    );

    if (!judgesGroup) {
      res.status(400).send({
        error: 'Not all groups provided in body.',
        data: { groupId: group._id?.toString() },
      });
    }

    // eslint-disable-next-line no-param-reassign
    group.currentRoundPairs = group.currentRoundPairs?.map((pair) => {
      const judgesPair = judgesGroup?.pairs.find(
        (p) => p.id === pair._id?.toString()
      );

      if (!judgesPair) {
        res.status(400).send({
          error: 'Not all pairs provided in body.',
          data: {
            groupId: group._id?.toString(),
            pairId: pair._id?.toString(),
          },
        });
      }

      if (judgesPair) {
        if (!judgesByIds[judgesPair.judgeId]) {
          res.status(400).send({
            error: 'Judge provided do not connect to competition.',
            data: {
              groupId: group._id?.toString(),
              pairId: pair._id?.toString(),
              judgeId: judgesPair.judgeId,
            },
          });
        }

        // eslint-disable-next-line no-param-reassign
        pair.judge = judgesByIds[judgesPair.judgeId];
      }
      return pair;
    });
    return group;
  });

  competition.groups = newGroups;

  await competition.save();
  res.send(competition);
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
  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

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
  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

  res.send(competition);
};

export const deleteCompetitionGroup = async (
  req: Request<{ id: string }, any, { groupId: string }>,
  res: Response
) => {
  const { id } = req.params;
  const { groupId } = req.body;

  const competition = await Competition.findById(id);
  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

  const { groups } = competition;

  const newGroups = groups?.filter(
    (group) => group._id?.toString() !== groupId
  );

  const newCompetition = await Competition.findOneAndUpdate(
    { _id: id },
    { groups: newGroups },
    { new: true }
  );

  res.send(newCompetition);
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
  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

  res.send(competition);
};

export const updateCompetitionZoomLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.zoomLink) return res.sendStatus(400);
  const { id } = req.params;

  const competition = await Competition.findOneAndUpdate(
    { _id: id },
    { zoomLink: req.body.zoomLink },
    { new: true }
  );
  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

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
  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

  const { allParticipants } = body;
  const firstRoundPairs: IPair[] = [];
  const currentRoundParticipantsAmount = getParticipantsAmountForCurrentRound(
    allParticipants.length
  );

  const shuffledParticipants = allParticipants.sort(() => Math.random() - 0.5);

  for (let i = 0; i < currentRoundParticipantsAmount; i += 2) {
    firstRoundPairs.push({
      blackParticipant: shuffledParticipants[i + 1],
      whiteParticipant: shuffledParticipants[i],
      passed: false,
    });
  }

  const group: ICompetitionGroup = {
    ...body,
    currentRoundPairs: firstRoundPairs,
    currentRoundNumber: 1,
    nextRoundParticipants: shuffledParticipants.slice(
      currentRoundParticipantsAmount
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

  res.send(competition);
};

export const getCompetitionGroups = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  if (!req.params?.id) return res.sendStatus(400);

  const competition = await Competition.findById(req.params.id);
  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

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
  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

  const user = await User.findOne({ _id: userId });
  if (!user) return res.status(404).send({ error: "user wasn't found" });

  if (competition && user) {
    user.save();

    competition.participants = [...competition.participants, user._id];
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
  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

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

    const ms2minutes = 120000;
    setTimeout(async () => {
      const currentCompetition = await Competition.findById(competitionId);

      const currentGroup = currentCompetition?.groups.find(
        (group) => group._id?.toString() === groupId
      );

      const currentPair = currentGroup?.currentRoundPairs.find(
        (pair) => pair._id?.toString() === pairId
      );
      if (currentGroup && currentPair) {
        const pairAcceptedForFight = currentPair.acceptedForFight;
        const whiteDisqualified = !pairAcceptedForFight?.whiteParticipant;
        const blackDisqualified = !pairAcceptedForFight?.blackParticipant;

        let wasPartnerDisqualified = false;
        if (blackDisqualified) {
          wasPartnerDisqualified = true;
          await User.findByIdAndUpdate(currentPair.blackParticipant, {
            $inc: {
              ratingNumber: -FIXED_RATING_CHANGING_NUM,
            },
            $push: {
              competitionsHistory: {
                competitionId,
                groupId,
                placeNumber:
                  currentGroup.allParticipants.length -
                  (currentGroup.passedPairs.length - 1),
              },
            },
          });
        }
        if (whiteDisqualified) {
          await User.findByIdAndUpdate(currentPair.whiteParticipant, {
            $inc: {
              ratingNumber: -FIXED_RATING_CHANGING_NUM,
            },
            $push: {
              competitionsHistory: {
                competitionId,
                groupId,
                placeNumber:
                  currentGroup.allParticipants.length -
                  (currentGroup.passedPairs.length -
                    1 -
                    (wasPartnerDisqualified ? 1 : 0)),
              },
            },
          });
        }

        const pairPassed = whiteDisqualified && blackDisqualified;

        currentPair.passed = pairPassed;
        currentPair.disqualified = {
          whiteParticipant: whiteDisqualified,
          blackParticipant: blackDisqualified,
        };
        if (pairPassed) {
          currentGroup?.passedPairs.push(currentPair);

          // because defineWinner won't be called
          const isGroupCompleted =
            currentGroup?.nextRoundParticipants?.length === 0 &&
            currentGroup?.currentRoundPairs?.length === 1;

          if (isGroupCompleted) {
            currentGroup.isCompleted = true;
            currentGroup.currentRoundPairs = [];

            const groupParticipants = await User.find({
              _id: {
                $in: currentGroup.allParticipants,
              },
            });

            const groupResults = groupParticipants
              .map((gp) => ({
                userId: gp._id,
                placeNumber: gp.competitionsHistory?.find(
                  (gpHistPoint) => gpHistPoint.competitionId === competitionId
                )?.placeNumber as number,
              }))
              .sort((a, b) => (a.placeNumber ?? 0) - (b.placeNumber ?? 0));

            currentGroup.results = groupResults;
          }
        }
      }

      await currentCompetition?.save();
    }, ms2minutes);

    return res.status(200).send(newCompetition);
  }

  res.sendStatus(500);
};

export const acceptPairFight = async (
  req: Request<
    any,
    any,
    { competitionId: string; groupId: string; pairId: string; userId: string }
  >,
  res: Response
) => {
  const { competitionId, groupId, pairId, userId } = req.body;
  const competition = await Competition.findById(competitionId);

  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

  let userIdNotFromThisPairs = false;

  const newGroups = competition?.groups.map((group) => {
    if (group._id?.toString() === groupId) {
      return {
        ...group,
        pairs: group.currentRoundPairs.map((pair) => {
          const { blackParticipant, whiteParticipant } = pair;

          if (pair._id?.toString() === pairId) {
            if (
              whiteParticipant?._id?.toString() !== userId &&
              blackParticipant?._id?.toString() !== userId
            ) {
              userIdNotFromThisPairs = true;
              return pair;
            }

            // eslint-disable-next-line no-param-reassign
            pair.acceptedForFight =
              whiteParticipant._id?.toString() === userId
                ? {
                    ...pair.acceptedForFight,
                    whiteParticipant: true,
                  }
                : {
                    ...pair.acceptedForFight,
                    blackParticipant: true,
                  };

            return pair;
          }
          return pair;
        }),
      };
    }
    return group;
  });

  if (userIdNotFromThisPairs) {
    return res.status(400).send({
      error: 'User is not from provided pair',
    });
  }

  if (competition && newGroups) {
    competition.groups = newGroups;

    const newCompetition = await Competition.findByIdAndUpdate(
      competitionId,
      competition,
      { new: true }
    );
    return res.status(200).send(newCompetition);
  }

  res.sendStatus(500);
};

export const setCompetitionGroupsOrders = async (
  req: Request<
    { id: string },
    any,
    { orders: { groupId: string; order: number }[] }
  >,
  res: Response
) => {
  const { orders } = req.body;

  const competition = await Competition.findById(req.params.id);
  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

  const newGroups = competition?.groups
    .map((g) => ({
      ...g,
      order: orders.find((order) => order.groupId === g._id?.toString())?.order,
    }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  competition.groups = newGroups;
  await competition.save();

  res.send(competition);
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
  });

  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

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

  const isGroupCompleted =
    competitionGroup?.nextRoundParticipants?.length === 0 &&
    competitionGroup?.currentRoundPairs?.length === 1;

  if (isGroupCompleted) {
    competitionGroup.isCompleted = true;
  }

  if (!isGroupCompleted) {
    competitionGroup.nextRoundParticipants = [
      ...competitionGroup.nextRoundParticipants,
      winnerId,
    ];
  }

  const passedPair = competitionGroup.currentRoundPairs.find(
    (pair) => pair._id?.toString() === pairId
  );

  if (!passedPair) {
    res.sendStatus(500);
    return;
  }

  competitionGroup.passedPairs = [
    ...(competitionGroup.passedPairs ?? []),
    { ...passedPair, passed: true, winner: winnerId },
  ];

  competitionGroup.currentRoundPairs = isGroupCompleted
    ? []
    : competitionGroup.currentRoundPairs.map((pair) => {
        if (pair._id?.toString() === pairId) {
          return { ...pair, passed: true, winner: winnerId };
        }

        return pair;
      });

  if (winner && loser) {
    const { newWinnerRating, newLoserRating } = recalculateRating(
      winner.ratingNumber,
      loser.ratingNumber
    );

    const loserPlaceNumber =
      competitionGroup.allParticipants.length -
      (competitionGroup.passedPairs.length - 1);

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
          // TODO: rewrite with both disqualified case, passedPairs length not enough
          competitionsHistory: [
            ...loser.competitionsHistory,
            {
              competitionId,
              groupId,
              placeNumber: loserPlaceNumber,
            },
          ],
        },
        { new: true }
      ),
      competition?.save(),
    ]);

    if (isGroupCompleted) {
      const groupParticipants = await User.find({
        _id: {
          $in: competitionGroup.allParticipants,
        },
      });

      const groupResults = groupParticipants
        .map((gp) => ({
          userId: gp._id,
          placeNumber: gp.competitionsHistory?.find(
            (gpHistPoint) => gpHistPoint.competitionId === competitionId
          )?.placeNumber as number,
        }))
        .sort((a, b) => (a.placeNumber ?? 0) - (b.placeNumber ?? 0));

      competitionGroup.results = groupResults;
    }

    return res.send(competition);
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
  });

  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

  const competitionGroup = competition?.groups.find(
    (group) => group._id?.toString() === groupId
  );
  const judges = competition?.judges;

  const nextRoundPairs: any[] = [];

  if (
    competition?.groups &&
    competitionGroup?.nextRoundParticipants &&
    competitionGroup?.currentRoundPairs
  ) {
    const shuffledParticipants = competitionGroup?.nextRoundParticipants.sort(
      () => Math.random() - 0.5
    );
    const currentRoundParticipantsAmount = getParticipantsAmountForCurrentRound(
      shuffledParticipants.length
    );

    for (let i = 0, j = 0; i < currentRoundParticipantsAmount; i += 2, j++) {
      nextRoundPairs.push({
        blackParticipant: competitionGroup.nextRoundParticipants[i + 1],
        whiteParticipant: competitionGroup.nextRoundParticipants[i],
        passed: false,
        judge: judges?.[j % judges.length],
      });
    }

    competitionGroup.nextRoundParticipants = shuffledParticipants.slice(
      currentRoundParticipantsAmount
    );
    competitionGroup.currentRoundNumber += 1;
    let currentPairOrder = 0;
    competitionGroup.currentRoundPairs = nextRoundPairs
      .map((pair) => ({
        ...pair,
        order: ++currentPairOrder,
      }))
      .sort(
        (a, b) =>
          // always true on that stage
          a.order - b.order
      );

    competition.groups = competition?.groups.map((group) => {
      if (group._id?.toString() === groupId) {
        return competitionGroup;
      }
      return group;
    });

    await competition.save();

    res.send(competition);
  }

  return res
    .status(400)
    .send({ error: 'No groups or nextRoundParticipants or pairs' });
};

export const getCompetitionParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const competition = await Competition.findOne({ _id: id }).populate(
    'participants'
  );

  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

  res.send(competition?.participants);
};

export const getCompetitionJudges = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const competition = await Competition.findOne({ _id: id }).populate('judges');

  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

  res.send(competition?.judges);
};

export const setCompetitionBreakTime = async (
  req: Request<{ id: string }, any, { breakTime: ICompetition['breakTime'] }>,
  res: Response
) => {
  const { id } = req.params;
  const { breakTime } = req.body;

  if (!breakTime) {
    return res.status(400).send({ error: 'No break time provided' });
  }

  const competition = await Competition.findOneAndUpdate(
    { _id: id },
    { breakTime }
  );

  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

  const breakTimeInMs = (breakTime?.minutes ?? 0) * 60 * 1000;

  setTimeout(async () => {
    await Competition.findOneAndUpdate({ _id: id }, { breakTime: null });
  }, breakTimeInMs);

  return res.sendStatus(200);
};

export const setUserPaymentRequestToCheck = async (
  req: Request,
  res: Response
) => {
  const { id, userId } = req.params;

  const competition = await Competition.findOne({ _id: id });

  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

  const requestUserPayInfo = competition.usersPaymentInfo?.find(
    (p) => p.userId.toString() === userId
  );

  const requestedCount = requestUserPayInfo?.requestedCount ?? 0;

  if (requestedCount >= 3) {
    return res.status(400).send({
      error:
        'You requested to check a payment more than 3 times. You can not participate in the competition.',
    });
  }
  if (requestUserPayInfo) {
    requestUserPayInfo.requestedToCheck = true;
    requestUserPayInfo.paid = false;
    requestUserPayInfo.requestedCount = requestedCount + 1;
  } else {
    const newUserPayInfo = {
      userId,
      paid: false,
      requestedToCheck: true,
      requestedCount: 1,
    };
    competition.usersPaymentInfo = competition.usersPaymentInfo
      ? [...competition.usersPaymentInfo, newUserPayInfo]
      : [newUserPayInfo];
  }

  await competition.save();

  res.send(competition);
};

export const setUserPaymentPaid = async (
  req: Request<{ id: string; userId: string }, any, { paid: boolean }>,
  res: Response
) => {
  const { id, userId } = req.params;
  const { paid } = req.body;

  const competition = await Competition.findOne({ _id: id });

  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

  const paidUserPayInfo = competition.usersPaymentInfo?.find(
    (p) => p.userId.toString() === userId
  );

  if (!paidUserPayInfo) {
    return res.status(404).send({ error: "User Pay Info wasn't found" });
  }

  paidUserPayInfo.requestedToCheck = paid;
  paidUserPayInfo.paid = paid;

  await competition.save();

  res.send(competition);
};

export const getCompetitionPaymentInfoUsers = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const competition = await Competition.findOne({ _id: id });
  if (!competition)
    return res.status(404).send({ error: "Competition wasn't found" });

  const paymentInfoUsersIds = competition.usersPaymentInfo?.map(
    (p) => p.userId
  );

  if (paymentInfoUsersIds) {
    const paymentInfoUsers = await User.find({
      _id: { $in: paymentInfoUsersIds },
    });

    return res.send(paymentInfoUsers);
  }

  res.send([]);
};
