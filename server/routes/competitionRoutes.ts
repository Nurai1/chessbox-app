import express from 'express';

import { CompetitionController, UserController } from '../controllers/index';
import { controllerErrorHandler } from '../utils/controllerErrorHandler';
import { RESOURCES, ACTIONS } from '../constants';
import { routerMockForSwaggerGenerator } from '../utils/routerMockForSwaggerGenerator';

export const competitionRouter = express.Router();

competitionRouter.get(
  '/competition/:id',
  /* #swagger.responses[200] = {
            description: 'Competition successfully obtained.',
            schema: { $ref: '#/definitions/Competition' }
    } */
  controllerErrorHandler(CompetitionController.getCompetition)
);

competitionRouter.get(
  '/competitions',
  /* #swagger.responses[200] = {
            description: 'Competition successfully obtained.',
            schema: [{ $ref: '#/definitions/Competition' }]
    } */
  controllerErrorHandler(CompetitionController.getCompetitions)
);

competitionRouter.post(
  '/competition',
  // #swagger.description = 'Cоздавать смогут только разработчики, будет удалено из апи перед релизом. Не использовать в коде.'
  /*	#swagger.requestBody = {
          required: true,
          content: {
              "application/json": {
                  schema: { $ref: "#/definitions/CompetitionBody" }
              },
          }
      } 
    */
  /* #swagger.responses[200] = {
            description: 'Competition successfully created.',
            schema: { $ref: '#/definitions/Competition' }
    } */
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.createAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.createCompetition)
);

competitionRouter.patch(
  '/competition/defineWinner',
  /* #swagger.security = [{
      "apiKeyAuth": []
  }] */
  /*	#swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        competitionId: { type: "string" },
                        groupId: { type: "string" },
                        pairId: { type: "string" },
                        winnerId: { type: "string" },
                        loserId: { type: "string" }
                      },
                      required: ["competitionId", "groupId", "pairId"]
                    }  
                },
            }
        } 
    */
  /* #swagger.responses[200] = {
            description: 'Winner defined.',
    } */
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.defineWinner)
);

competitionRouter.patch(
  '/competition/launchNextGroupRound',
  /* #swagger.security = [{
      "apiKeyAuth": []
  }] */
  /*	#swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        competitionId: { type: "string" },
                        groupId: { type: "string" },
                      },
                      required: ["groupId", "competitionId"]
                    }  
                },
            }
        } 
    */
  /* #swagger.responses[200] = {
            description: 'Next Group Round launched.',
    } */
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.launchNextGroupRound)
);

competitionRouter.patch(
  '/competition/callPairPreparation',
  /* #swagger.security = [{
      "apiKeyAuth": []
  }] */
  /*	#swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        competitionId: { type: "string" },
                        groupId: { type: "string" },
                        pairId: { type: "string" },
                      },
                      required: ["pairId", "groupId", "competitionId"]
                    }  
                },
            }
        } 
    */
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/Competition' }
    } */
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.callPairPreparation)
);

competitionRouter.patch(
  '/competition/setJudgesToCompetition',
  /* #swagger.security = [{
      "apiKeyAuth": []
  }] */
  /*	#swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        judgesIds: { type: "array", items: { type: "string" } },
                        competitionId: { type: "string" },
                      },
                      required: ["judgesIds", "competitionId"]
                    }  
                },
            }
        } 
    */
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/Competition' }
    } */
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.setJudgesToCompetition)
);

competitionRouter.patch(
  '/competition/:id',
  // #swagger.description = 'Редактировать смогут только разработчики, будет удалено из апи перед релизом. Не использовать в коде.'
  /*	#swagger.requestBody = {
          required: true,
          content: {
              "application/json": {
                  schema: { $ref: "#/definitions/Competition" }
              },
          }
      } 
    */
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/Competition' }
    } */
  controllerErrorHandler(CompetitionController.updateCompetition)
);

competitionRouter.patch(
  '/competition/:id/setCompetitionGroupsOrders',
  /* #swagger.security = [{
      "apiKeyAuth": []
  }] */
  /*	#swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        orders: { type: "array", items: { 
                            type: "object",
                            properties: {
                              groupId: { type: "string" },
                              order: { type: "number" },
                            },
                            required: ["groupId", "order"]
                          } 
                        },
                      },
                      required: ["orders"]
                    }  
                },
            }
        } 
    */
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/Competition' }
    } */
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.setJudgesToCompetition)
);

competitionRouter.patch(
  '/competition/:id/start',
  /* #swagger.security = [{
      "apiKeyAuth": []
  }] */
  /* #swagger.responses[200] = {
            description: '',
    } */
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.startCompetition)
);

competitionRouter.delete(
  '/competition/:id',
  // #swagger.description = 'Удалять смогут только разработчики, будет удалено из апи перед релизом. Не использовать в коде.'
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/Competition' }
    } */
  controllerErrorHandler(CompetitionController.deleteCompetition)
);

competitionRouter.post(
  '/competition/:id/group',
  /* #swagger.security = [{
      "apiKeyAuth": []
  }] */
  /*	#swagger.requestBody = {
          required: true,
          content: {
              "application/json": {
                  schema: { $ref: "#/definitions/CompetitionGroupBody" }
              },
          }
      } 
    */
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/Competition' }
    } */
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.createCompetitionGroup)
);

competitionRouter.get(
  '/competition/:id/groups',
  /* #swagger.responses[200] = {
            description: '',
            schema: [{ $ref: '#/definitions/CompetitionGroup' }]
    } */
  controllerErrorHandler(CompetitionController.getCompetitionGroups)
);

competitionRouter.patch(
  '/competition/:id/addNewParticipant',
  /* #swagger.security = [{
      "apiKeyAuth": []
  }] */
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/Competition' }
    } */
  /*	#swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        userId: { type: "string" },
                      },
                      required: ["userId"]
                    }
                },
            }
        } 
    */
  UserController.allowIfLoggedin,
  controllerErrorHandler(CompetitionController.addNewParticipant)
);

competitionRouter.get(
  '/competition/:id/participants',
  /* #swagger.responses[200] = {
            description: 'Competition\'s Participants',
            schema: [{ $ref: '#/definitions/User' }]
    } */
  controllerErrorHandler(CompetitionController.getCompetitionParticipants)
);

competitionRouter.get(
  '/competition/:id/judges',
  /* #swagger.responses[200] = {
            description: 'Competition\'s Judges',
            schema: [{ $ref: '#/definitions/User' }]
    } */
  controllerErrorHandler(CompetitionController.getCompetitionJudges)
);

routerMockForSwaggerGenerator.use(
  '/api',
  competitionRouter
  // #swagger.tags = ['Competitions']
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
            }
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
