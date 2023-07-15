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
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.defineWinner)
);

competitionRouter.patch(
  '/competition/launchNextGroupRound',
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
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.launchNextGroupRound)
);

competitionRouter.patch(
  '/competition/callPairPreparation',
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
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.callPairPreparation)
);

competitionRouter.patch(
  '/competition/setJudgesToCompetition',
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
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.setJudgesToCompetition)
);

competitionRouter.patch(
  '/competition/:id',
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
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.updateCompetition)
);

competitionRouter.patch(
  '/competition/:id/setCompetitionGroupsOrders',
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
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.setJudgesToCompetition)
);

competitionRouter.patch(
  '/competition/:id/start',
  /* #swagger.responses[200] = {
            description: '',
    } */
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.startCompetition)
);

competitionRouter.delete(
  '/competition/:id',
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/Competition' }
    } */
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.deleteAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.deleteCompetition)
);

competitionRouter.post(
  '/competition/:id/group',
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
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.createAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.createCompetitionGroup)
);

competitionRouter.get(
  '/competition/:id/groups',
  /* #swagger.responses[200] = {
            description: '',
            schema: [{ $ref: '#/definitions/CompetitionGroup' }]
    } */
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.createAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.getCompetitionGroups)
);

competitionRouter.patch(
  '/competition/:id/addNewParticipant',
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
  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.updateAny, RESOURCES.COMPETITION),
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
