import express from 'express';

import * as UserController from './controlllers/user.controller.js';
import { controllerErrorHandler } from './utils/index.js';
import { RESOURCES, ACTIONS } from './constants.js';

const router = express.Router();

router.post('/sigup', UserController.signup);

router.post('/login', UserController.login);

router.get(
  '/users/:userId',
  UserController.allowIfLoggedin,
  controllerErrorHandler(UserController.getUser)
);

router.get(
  '/users',
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.readAny, RESOURCES.USER),
  controllerErrorHandler(UserController.getUsers)
);

router.post(
  '/users/:userId',
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.createAny, RESOURCES.USER),
  controllerErrorHandler(UserController.createUser)
);

router.put(
  '/user/:userId',
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.updateAny, RESOURCES.USER),
  controllerErrorHandler(UserController.updateUser)
);

router.delete(
  '/user/:userId',
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.deleteAny, RESOURCES.USER),
  controllerErrorHandler(UserController.deleteUser)
);

export default router;
