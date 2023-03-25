// import express from 'express';

// import {
//   CompetitionGroupController,
//   UserController,
// } from '../controlllers/index.js';
// import { controllerErrorHandler } from '../utils/controllerErrorHandler.js';
// import { RESOURCES, ACTIONS } from '../constants.js';

// export const competitionGroupRouter = express.Router();

// competitionGroupRouter.get(
//   '/competitionGroup/:id',
//   controllerErrorHandler(CompetitionGroupController.getCompetitionGroup)
// );

// competitionGroupRouter.get(
//   '/competitionGroups',
//   controllerErrorHandler(CompetitionGroupController.getCompetitionGroups)
// );

// competitionGroupRouter.post(
//   '/competitionGroup',
//   // UserController.allowIfLoggedin,
//   // UserController.grantAccessACTIONS.createAny, RESOURCES.COMPETITION),
//   controllerErrorHandler(CompetitionGroupController.createCompetitionGroup)
// );

// competitionGroupRouter.put(
//   '/competitionGroup/:id',
//   // UserController.allowIfLoggedin,
//   // UserController.grantAccessACTIONS.updateAny, RESOURCES.COMPETITION),
//   controllerErrorHandler(CompetitionGroupController.updateCompetitionGroup)
// );

// competitionGroupRouter.delete(
//   '/competitionGroup/:id',
//   // UserController.allowIfLoggedin,
//   // UserController.grantAccessACTIONS.deleteAny, RESOURCES.COMPETITION),
//   controllerErrorHandler(CompetitionGroupController.deleteCompetitionGroup)
// );
