// import express from 'express';

// import { PairController, UserController } from '../controlllers/index.js';
// import { controllerErrorHandler } from '../utils/controllerErrorHandler.js';
// import { RESOURCES, ACTIONS } from '../constants.js';

// export const pairRouter = express.Router();

// pairRouter.get(
//   '/pair/:id',
//   // UserController.allowIfLoggedin,
//   // UserController.grantAccessACTIONS.readAny, RESOURCES.PAIR),
//   controllerErrorHandler(PairController.getPair)
// );

// pairRouter.get(
//   '/pairs',
//   // UserController.allowIfLoggedin,
//   // UserController.grantAccessACTIONS.readAny, RESOURCES.PAIR),
//   controllerErrorHandler(PairController.getPairs)
// );

// pairRouter.post(
//   '/pair',
//   // UserController.allowIfLoggedin,
//   // UserController.grantAccessACTIONS.createAny, RESOURCES.PAIR),
//   controllerErrorHandler(PairController.createPair)
// );

// pairRouter.put(
//   '/pair',
//   // UserController.allowIfLoggedin,
//   // UserController.grantAccessACTIONS.updateAny, RESOURCES.PAIR),
//   controllerErrorHandler(PairController.updatePair)
// );

// pairRouter.delete(
//   '/pair/:id',
//   // UserController.allowIfLoggedin,
//   // UserController.grantAccessACTIONS.deleteAny, RESOURCES.PAIR),
//   controllerErrorHandler(PairController.deletePair)
// );

// pairRouter.patch(
//   '/defineWinner',
//   // UserController.allowIfLoggedin,
//   // UserController.grantAccessACTIONS.deleteAny, RESOURCES.PAIR),
//   controllerErrorHandler(PairController.defineWinner)
// );
