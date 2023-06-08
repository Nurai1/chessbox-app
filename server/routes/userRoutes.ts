import express from 'express';

import { UserController } from '../controlllers/index';
import { controllerErrorHandler } from '../utils/controllerErrorHandler';
import { RESOURCES, ACTIONS } from '../constants';

export const userRouter = express.Router();

userRouter.post('/signup', controllerErrorHandler(UserController.signup));

userRouter.post('/login', controllerErrorHandler(UserController.login));

userRouter.get(
  '/user/:id',
  // UserController.allowIfLoggedin,
  controllerErrorHandler(UserController.getUser)
);

userRouter.get(
  '/users',
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.readAny, RESOURCES.USER),
  controllerErrorHandler(UserController.getUsers)
);

userRouter.post(
  '/user',
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.createAny, RESOURCES.USER),
  controllerErrorHandler(UserController.createUser)
);

userRouter.patch(
  '/user',
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.updateAny, RESOURCES.USER),
  controllerErrorHandler(UserController.updateUser)
);

userRouter.delete(
  '/user/:id',
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.deleteAny, RESOURCES.USER),
  controllerErrorHandler(UserController.deleteUser)
);
