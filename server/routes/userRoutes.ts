import express from 'express';

import { UserController } from '../controllers/index';
import { controllerErrorHandler } from '../utils/controllerErrorHandler';
import { RESOURCES, ACTIONS } from '../constants';
import { routerMockForSwaggerGenerator } from '../utils/routerMockForSwaggerGenerator';

export const userRouter = express.Router();

userRouter.post(
  '/signup',
  /*	#swagger.requestBody = {
          required: true,
          content: {
              "application/json": {
                  schema: {
                      type: "object",
                      properties: {
                        email: {  
                          type: "string",
                        },
                        password: {  
                          type: "string",
                        },
                        firstName: {
                          type: "string",
                        },
                        lastName: {
                          type: "string",
                        },
                        weight: {
                          type: "number",
                        },
                        age: {
                          type: "number",
                        },
                        gender: {
                          type: "string"
                        },
                        chessPlatform: {  
                          type: "object",
                          properties: {
                            username: {
                              type: "string"
                            }
                          },
                          required: ["username"]
                        },
                        address: {  
                          type: "object",
                          properties: {
                            country: {
                              type: "string"
                            },
                            city: {
                              type: "string"
                            },
                          },
                          required: ["city", "country"]
                        },
                        fightClub: {  
                          type: "object",
                          properties: {
                            name: {
                              type: "string"
                            }
                          },
                          required: ["name"]
                        }
                      },
                      required: ["firstName", "lastName", "weight", "age", "gender", "address", "chessPlatform", "fightClub", "email", "password"]
                  }
              }
          }
      } 
    */
  /* #swagger.responses[200] = {
            description: '',
            schema: {
                accessToken: "string",
                data: {  
                  $ref: '#/definitions/User' 
                },
             }
    } */
  controllerErrorHandler(UserController.signup)
);

userRouter.post(
  '/login',
  /*	#swagger.requestBody = {
          required: true,
          content: {
              "application/json": {
                  schema: {
                      type: "object",
                      properties: {
                        email: {  
                          type: "string",
                        },
                        password: {  
                          type: "string",
                        }
                      },
                      required: ["email", "password"]
                  }
              },
          }
      } 
    */
  /* #swagger.responses[200] = {
            description: '',
            "application/json": {
              schema: {
                  accessToken: "string",
              }
            },
    } */
  controllerErrorHandler(UserController.login)
);

userRouter.get(
  '/user/:id',
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/User' }
    } */

  // UserController.allowIfLoggedin,
  controllerErrorHandler(UserController.getUser)
);

userRouter.get(
  '/users',
  /*  #swagger.parameters['search'] = {
          in: 'query',
          schema: { type: "string" }
  } */
  /*  #swagger.parameters['limit'] = {
          in: 'query',
          schema: { type: "number" }
  } */
  /*  #swagger.parameters['offset'] = {
          in: 'query',
          schema: { type: "number" }
  } */
  /*  #swagger.parameters['ageFrom'] = {
          in: 'query',
          schema: { type: "number" }
  } */
  /*  #swagger.parameters['ageTo'] = {
          in: 'query',
          schema: { type: "number" }
  } */
  /*  #swagger.parameters['weightFrom'] = {
          in: 'query',
          schema: { type: "number" }
  } */
  /*  #swagger.parameters['weightTo'] = {
          in: 'query',
          schema: { type: "number" }
  } */
  /*  #swagger.parameters['withWomen'] = {
          in: 'query',
          schema: { type: "boolean" }
  } */
  /*  #swagger.parameters['withMen'] = {
          in: 'query',
          schema: { type: "boolean" }
  } */
  /* 
    #swagger.responses[200] = {
            description: '',
            schema: { items: [{ $ref: '#/definitions/User' }], total: 0 }
    } */

  UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.readAny, RESOURCES.USER),
  controllerErrorHandler(UserController.getUsers)
);

userRouter.get(
  '/user/:id/nearestPair',
  /* #swagger.responses[200] = {
            description: 'Each attrubute can be null. If pair is null, then the user is waiting in the "Next Round Participants"',
            schema: { pair: { $ref: '#/definitions/Pair' }, roundDivider: 8 }
    } */

  controllerErrorHandler(UserController.getUserCurrentPair)
);

userRouter.post(
  '/user',
  /*	#swagger.requestBody = {
          required: true,
          content: {
              "application/json": {
                  schema: { $ref: "#/definitions/UserBody" }
              },
          }
      } 
    */
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/User' }
    } */

  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.createAny, RESOURCES.USER),
  controllerErrorHandler(UserController.createUser)
);

userRouter.patch(
  '/user',
  /*	#swagger.requestBody = {
          required: true,
          content: {
              "application/json": {
                  schema: { $ref: "#/definitions/User" }
              },
          }
      } 
    */
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/User' }
    } */

  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.updateAny, RESOURCES.USER),
  controllerErrorHandler(UserController.updateUser)
);

userRouter.delete(
  '/user/:id',
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/User' }
    } */

  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.deleteAny, RESOURCES.USER),
  controllerErrorHandler(UserController.deleteUser)
);

routerMockForSwaggerGenerator.use(
  '/api',
  userRouter
  // #swagger.tags = ['Users']
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
