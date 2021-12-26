import { Router } from 'express';
import * as UserController from './controlllers/user.controller';
import { controllerErrorHandler } from './utils';
import { RESOURCES, ACTIONS } from './constants';

const router = Router();

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
