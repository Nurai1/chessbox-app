import express from 'express';

import { UserController } from '../controllers/index';
import { controllerErrorHandler } from '../utils/controllerErrorHandler';
import { RESOURCES, ACTIONS } from '../constants';
import { routerMockForSwaggerGenerator } from '../utils/routerMockForSwaggerGenerator';

export const userRouter = express.Router();

userRouter.post(
  '/signup',
  // #swagger.tags = ['Users']
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
  // #swagger.tags = ['Users']
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
  // #swagger.tags = ['Users']
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/User' }
    } */

  // UserController.allowIfLoggedin,
  controllerErrorHandler(UserController.getUser)
);

userRouter.get(
  '/users',
  // #swagger.tags = ['Users']
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

  // UserController.allowIfLoggedin,
  // UserController.grantAccessACTIONS.readAny, RESOURCES.USER),
  controllerErrorHandler(UserController.getUsers)
);

userRouter.post(
  '/user',
  // #swagger.tags = ['Users']
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
  // UserController.grantAccessACTIONS.createAny, RESOURCES.USER),
  controllerErrorHandler(UserController.createUser)
);

userRouter.patch(
  '/user',
  // #swagger.tags = ['Users']
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
  // #swagger.tags = ['Users']
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
  /* #swagger.responses[500] = {
            description: 'Internal server error.',
            schema: {
              error: "string"
            }
    } */
  /* #swagger.responses[400] = {
            description: 'Internal server error.',
            schema: {
              error: "string",
            }
    } */
  /* #swagger.responses[401] = {
          description: 'Internal server error.',
          schema: {
            error: "string",
          }
  } */
);
