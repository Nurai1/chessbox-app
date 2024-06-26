import express from 'express';

import { ACTIONS, RESOURCES } from '../constants';
import { UserController } from '../controllers/index';
import { createUser } from '../controllers/user.controller';
import { controllerErrorHandler } from '../utils/controllerErrorHandler';
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
                        birthDate: {
                          type: "string",
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
                      required: ["firstName", "lastName", "weight", "birthDate", "gender", "address", "chessPlatform", "fightClub", "email", "password"]
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

userRouter.patch(
  '/user/confirmEmail',
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
                        confirmationCode: {  
                          type: "string",
                        },
                      },
                      required: ["email", "confirmationCode"]
                  }
              },
          }
      } 
    */
  controllerErrorHandler(UserController.confirmEmail)
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
                  data: {  
                    $ref: '#/definitions/User' 
                  },
              }
            },
    } */
  controllerErrorHandler(UserController.login)
);

userRouter.patch(
  '/user/changePassword',
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
                        newPassword: {  
                          type: "string",
                        },
                        passwordResetCode: {  
                          type: "number",
                        },
                      },
                      required: ["email", "newPassword", "passwordResetCode"]
                  }
              },
          }
      } 
    */
  controllerErrorHandler(UserController.changePassword)
);

userRouter.post(
  '/user/forgotPassword',
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
                      },
                      required: ["email"]
                  }
              },
          }
      } 
    */
  controllerErrorHandler(UserController.forgotPassword)
);

userRouter.get(
  '/user/getCurrentUser',
  /* #swagger.security = [{
      "apiKeyAuth": []
  }] */
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/User' }
    } */

  UserController.allowIfLoggedin,
  controllerErrorHandler(UserController.getCurrentUser)
);

userRouter.get(
  '/user/:id',
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/User' }
    } */

  controllerErrorHandler(UserController.getUser)
);

userRouter.get(
  '/users',
  /* #swagger.security = [{
      "apiKeyAuth": []
  }] */
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
  /*  #swagger.parameters['role'] = {
          in: 'query',
          schema: { type: "string" }
  } */
  /* 
    #swagger.responses[200] = {
            description: '',
            schema: { items: [{ $ref: '#/definitions/User' }], total: 0 }
    } */
  controllerErrorHandler(UserController.getUsers)
);

userRouter.get(
  '/allJudges',
  /* #swagger.security = [{
      "apiKeyAuth": []
  }] */
  /* #swagger.responses[200] = {
            schema: [{ $ref: '#/definitions/User' }]
    } */
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.readAny, RESOURCES.USER),
  controllerErrorHandler(UserController.getAllJudges)
);

userRouter.post(
  '/user',
  // #swagger.description = 'Для внутренних нужд разработчиков, не использовать в коде.'
  /*	#swagger.requestBody = {
          required: true,
          content: {
              "application/json": {
                  schema: { 
                    type: "object",
                      properties: {
                        password: {  
                          type: "string",
                        },
                        user: {
                          $ref: "#/definitions/UserBody"
                        }
                      },
                      required: ["password", "user"]
                    }
                  }
              },
          }
      } 
    */
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/User' }
    } */
  controllerErrorHandler(createUser)
);

userRouter.patch(
  '/user/currentUser',
  /* #swagger.security = [{
      "apiKeyAuth": []
  }] */
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
  UserController.allowIfLoggedin,
  UserController.grantAccess(ACTIONS.updateOwn, RESOURCES.USER),
  controllerErrorHandler(UserController.updateCurrentUser)
);

userRouter.patch(
  '/user',
  // #swagger.description = 'Для внутренних нужд разработчиков, не использовать в коде.'
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
  controllerErrorHandler(UserController.updateUser)
);

userRouter.delete(
  '/user/:id',
  // #swagger.description = 'Для внутренних нужд разработчиков, не использовать в коде.'
  /* #swagger.responses[200] = {
            description: '',
            schema: { $ref: '#/definitions/User' }
    } */
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
