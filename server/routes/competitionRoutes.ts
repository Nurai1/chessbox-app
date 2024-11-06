import express from 'express';

import { ACTIONS, MONGO_ENV, RESOURCES } from '../constants';
import { CompetitionController, UserController } from '../controllers/index';
import { allowIfLoggedin, grantAccess } from '../controllers/user.controller';
import { controllerErrorHandler } from '../utils/controllerErrorHandler';
import '../utils/dotenvConfig';
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
            schema: { $ref: '#/definitions/Competition' }
    } */
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
            schema: { $ref: '#/definitions/Competition' }
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
  '/competition/acceptPairFight',
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
                        userId: { type: "string" },
                      },
                      required: ["pairId", "groupId", "competitionId", "userId"]
                    }  
                },
            }
        } 
    */
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/Competition' }
    } */
  // uncomment after competition, find other decision, TODO
  // UserController.allowIfLoggedin,
  // UserController.grantAccess(ACTIONS.updateOwn, RESOURCES.PAIR),
  controllerErrorHandler(CompetitionController.acceptPairFight)
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
  '/competition/setJudgesToPairs',
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
                        judgesByGroups: { type: "array", items: {
                            type: "object",
                            properties: {
                              id: { type: "string" },
                              pairs: { type: "array", items: {
                                type: "object",
                                properties: {
                                  id: { type: "string" },
                                  judgeId: { type: "string" },
                                },
                                required: ["id", "judgeId"]
                              } },
                            },
                            required: ["id", "pairs"]
                        } },
                        competitionId: { type: "string" },
                      },
                      required: ["competitionId"]
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
  controllerErrorHandler(CompetitionController.setJudgesToPairs)
);

// for developers only
if (MONGO_ENV !== 'develop') {
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
}

competitionRouter.patch(
  '/competition/:id/recalculatePairsTime',
  // #swagger.description = ''
  /* #swagger.responses[200] = {
            description: '',
    } */
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.recalculatePairsTime)
);

competitionRouter.patch(
  '/competition/:id/setParticipantsOrdersByGroup',
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
                      anyGroupId: { type: "array", items: { type: "string" } },
                    },
                  },
              }
          },
          description: 'anyGroupId key means all groupIds here. It is Record JSON',
      }
    */
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/Competition' }
    } */
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.setParticipantsOrdersByGroup)
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
  controllerErrorHandler(CompetitionController.setCompetitionGroupsOrders)
);

competitionRouter.patch(
  '/competition/:id/start',
  /* #swagger.security = [{
      "apiKeyAuth": []
  }] */
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/Competition' }
    } */
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.startCompetition)
);

competitionRouter.patch(
  '/competition/:id/end',
  /* #swagger.security = [{
      "apiKeyAuth": []
  }] */
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/Competition' }
    } */
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.endCompetition)
);

competitionRouter.patch(
  '/competition/:id/zoomLink',
  /*	#swagger.requestBody = {
          required: true,
          content: {
              "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        zoomLink: {  
                          type: "string",
                        },
                      },
                      required: ["zoomLink"]
                  }
              },
          }
      } 
    */
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/Competition' }
    } */
  controllerErrorHandler(CompetitionController.updateCompetitionZoomLink)
);

competitionRouter.delete(
  '/competition/:id/group',
  /*	#swagger.requestBody = {
          required: true,
          content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                groupId: { type: "string" },
              },
              required: ["groupId"]
            },
          }
        } 
      } 
    */
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/Competition' }
    } */
  controllerErrorHandler(CompetitionController.deleteCompetitionGroup)
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

competitionRouter.get(
  '/competition/:id/paymentInfoUsers',
  /* #swagger.responses[200] = {
            description: 'Competition\'s Payment Info Users',
            schema: [{ $ref: '#/definitions/User' }]
    } */
  controllerErrorHandler(CompetitionController.getCompetitionPaymentInfoUsers)
);

competitionRouter.patch(
  '/competition/:id/setCompetitionBreakTime',
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
                        breakTime: {
                          type: "object",
                          properties: {
                            minutes: { type: "number" },
                          },
                          required: ["minutes"]
                        },
                      },
                      required: ["breakTime"]
                    }
                },
            }
        } 
    */
  /* #swagger.responses[200] = {
            description: '',
    } */
  allowIfLoggedin,
  grantAccess(ACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.setCompetitionBreakTime)
);

if (
  process.env.ENVIRONMENT === 'staging' ||
  process.env.ENVIRONMENT === 'development'
) {
  competitionRouter.patch(
    '/competition/:id/allUsersPaymentRequestToCheck',
    // #swagger.description = 'Только для ускорения тестирования.'
    /* #swagger.security = [{
      "apiKeyAuth": []
  }] */
    /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/Competition' }
    } */
    controllerErrorHandler(CompetitionController.allUsersPaymentRequestToCheck)
  );
}

competitionRouter.patch(
  '/competition/:id/setUserPaymentRequestToCheck/:userId',
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
                        message: {
                          type: "string",
                        },
                      },
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
  // UserController.grantAccess(ACTIONS.updateOwn, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.setUserPaymentRequestToCheck)
);

competitionRouter.patch(
  '/competition/:id/setUserPaymentPaid/:userId',
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
                        paid: {
                          type: "boolean",
                        },
                      },
                      required: ["paid"]
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
  // UserController.grantAccess(ACTIONS.updateAny, RESOURCES.COMPETITION),
  controllerErrorHandler(CompetitionController.setUserPaymentPaid)
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
