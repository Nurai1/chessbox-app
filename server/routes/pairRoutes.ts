import express from 'express';

import { PairController, UserController } from '../controlllers/index.js';
import { controllerErrorHandler } from '../utils/index.js';
import { RESOURCES, ACTIONS } from '../constants.js';

export const pairRouter = express.Router();

pairRouter.get(
  '/pair/:id',
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.readAny, RESOURCES.PAIR),
  controllerErrorHandler(PairController.getPair)
);

pairRouter.get(
  '/pairs',
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.readAny, RESOURCES.PAIR),
  controllerErrorHandler(PairController.getPairs)
);

pairRouter.post(
  '/pair/:id',
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.createAny, RESOURCES.PAIR),
  controllerErrorHandler(PairController.createPair)
);

pairRouter.put(
  '/pair/:id',
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.updateAny, RESOURCES.PAIR),
  controllerErrorHandler(PairController.updatePair)
);

pairRouter.delete(
  '/pair/:id',
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.deleteAny, RESOURCES.PAIR),
  controllerErrorHandler(PairController.deletePair)
);
