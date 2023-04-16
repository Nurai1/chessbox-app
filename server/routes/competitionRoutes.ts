import express from 'express';

import {
  CompetitionController,
  UserController,
} from '../controlllers/index.js';
import { controllerErrorHandler } from '../utils/controllerErrorHandler.js';
import { RESOURCES, ACTIONS } from '../constants.js';

export const competitionRouter = express.Router();

competitionRouter.get(
  '/competition/:id',
  controllerErrorHandler(CompetitionController.getCompetition)
);

competitionRouter.get(
  '/competitions',
  controllerErrorHandler(CompetitionController.getCompetitions)
);

competitionRouter.post(
  '/competition',
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.createAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.createCompetition)
);

competitionRouter.patch(
  '/competition/defineWinner',
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.defineWinner)
);

competitionRouter.patch(
  '/competition/launchNextGroupRound',
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.launchNextGroupRound)
);

competitionRouter.patch(
  '/competition/callPairPreparation',
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.callPairPreparation)
);

competitionRouter.patch(
  '/competition/:id',
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.updateCompetition)
);

competitionRouter.delete(
  '/competition/:id',
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.deleteAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.deleteCompetition)
);

competitionRouter.post(
  '/competition/:id/group',
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.createAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.createCompetitionGroup)
);

competitionRouter.get(
  '/competition/:id/groups',
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.createAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.getCompetitionGroups)
);

competitionRouter.patch(
  '/competition/:id/addNewParticipant',
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.addNewParticipant)
);
