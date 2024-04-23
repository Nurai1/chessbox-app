import express from 'express';

import multer from 'multer';
import { CompetitionDataController } from '../controllers/index';
import { controllerErrorHandler } from '../utils/controllerErrorHandler';
import '../utils/dotenvConfig';
import { routerMockForSwaggerGenerator } from '../utils/routerMockForSwaggerGenerator';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const competitionDataRouter = express.Router();

competitionDataRouter.post(
  '/uploadBanner/:competitionId',
  // #swagger.description = 'Загрузка баннера для соревнования из Postman.'
  upload.single('banner'),
  /* #swagger.responses[200] = {
            description: 'Competition Banner successfully created.',
            schema: { message: "string" }
    } */
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.createAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionDataController.uploadBanner)
);

competitionDataRouter.get(
  '/competitionBanner/:competitionId',
  // #swagger.description = 'Получить баннер соревнования'
  /* #swagger.responses[200] = {
            description: 'Competition Banner successfully created.',
            schema: { message: "string" }
    } */
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.createAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionDataController.getCompetitionBanner)
);

routerMockForSwaggerGenerator.use(
  '/api',
  competitionDataRouter
  // #swagger.tags = ['Competition Data']
  /* #swagger.responses[500] = {
            description: 'Internal server error.',
            schema: {
              error: "string"
            }
    } */
  /* #swagger.responses[400] = {
            description: 'Client error.',
            schema: {
              error: "string",
              data: {}
            },
    } */
  /* #swagger.responses[401] = {
          description: 'Unauthorized error.',
          schema: {
            error: "string",
          }
  } */
  /* #swagger.responses[403] = {
          description: 'Permissions error.',
          schema: {
            error: "string",
          }
  } */
  /* #swagger.responses[404] = {
            description: 'Not Found error.',
            schema: {
              error: "string",
            }
    } */
);
