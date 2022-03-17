import express from 'express';

import { UserController } from '../controlllers/index.js';
import { controllerErrorHandler } from '../utils/index.js';
import { RESOURCES, ACTIONS } from '../constants.js';

export const userRouter = express.Router();

userRouter.post('/signup', UserController.signup);

userRouter.post('/login', UserController.login);

userRouter.get(
  '/user/:id',
  UserController.allowIfLoggedin,
  controllerErrorHandler(UserController.getUser)
);

userRouter.get(
  '/users',
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.readAny, RESOURCES.USER),
  controllerErrorHandler(UserController.getUsers)
);

userRouter.post(
  '/user',
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.createAny, RESOURCES.USER),
  controllerErrorHandler(UserController.createUser)
);

userRouter.put(
  '/user/:id',
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.updateAny, RESOURCES.USER),
  controllerErrorHandler(UserController.updateUser)
);

userRouter.delete(
  '/user/:id',
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.deleteAny, RESOURCES.USER),
  controllerErrorHandler(UserController.deleteUser)
);
