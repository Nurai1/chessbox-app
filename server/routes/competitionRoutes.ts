import express from 'express';

import { CompetitionController, UserController } from '../controlllers/index.js';
import { controllerErrorHandler } from '../utils/index.js';
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
  '/competition/:id',
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.createAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.createCompetition)
);

competitionRouter.put(
  '/competition/:id',
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.updateCompetition)
);

competitionRouter.delete(
  '/competition/:id',
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.deleteAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.deleteCompetition)
);
