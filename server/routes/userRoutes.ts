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
                        username: {  
                          type: "string",
                        },
                        email: {  
                          type: "string",
                        },
                        password: {  
                          type: "string",
                        },
                        role: {  
                          type: "string",
                        }
                      },
                      required: ["username", "email", "password"]
                  }
              },
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
  /* #swagger.responses[200] = {
            description: '',
            schema: [{ $ref: '#/definitions/User' }]
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
);
