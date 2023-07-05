import swaggerAutogenInit from 'swagger-autogen';
import {
  Competition,
  User,
  competitionGroupSchema,
  pairSchema,
} from './models';
import mongoose from 'mongoose';

const m2s = require('mongoose-to-swagger');

const swaggerAutogen = swaggerAutogenInit({ openapi: '3.0.0' });

const outputFile = './swagger_output.json';
const endpointsFiles = [
  './routes/userRoutes.ts',
  './routes/competitionRoutes.ts',
];

const m2sOptions = { props: ['identificator'] };
const swaggerCompetition = m2s(Competition, m2sOptions);
const swaggerUser = m2s(User, m2sOptions);
const swaggerCompetitionGroup = m2s(
  mongoose.model('CompetitionGroup', competitionGroupSchema),
  m2sOptions
);
const swaggerPair = m2s(mongoose.model('Pair', pairSchema), m2sOptions);

const swaggerCompetitionGroupBody = swaggerCompetitionGroup;
swaggerCompetitionGroupBody.required = [
  ...(swaggerCompetitionGroupBody.required ?? []),
  '_id',
];
const swaggerCompetitionBody = swaggerCompetition;
swaggerCompetitionBody.required = [
  ...(swaggerCompetitionBody.required ?? []),
  '_id',
];
const swaggerPairBody = swaggerPair;
swaggerPairBody.required = [...(swaggerPairBody.required ?? []), '_id'];
const swaggerUserBody = swaggerUser;
swaggerUserBody.required = [...(swaggerUserBody.required ?? []), '_id'];

const doc = {
  info: {
    version: '1.0.0', // by default: '1.0.0'
    title: 'Chessbox API', // by default: 'REST API'
    description:
      'This is the private API of the endpoints for Chessbox application.', // by default: ''
  },
  host: 'localhost:3001', // by default: 'localhost:3000'
  basePath: '', // by default: '/'
  schemes: ['http'], // by default: ['http']
  consumes: ['application/json'], // by default: ['application/json']
  produces: ['application/json'], // by default: ['application/json']
  tags: [
    {
      name: 'Users',
    },
    {
      name: 'Competitions',
    },
  ],
  securityDefinitions: {}, // by default: empty object
  '@definitions': {
    Competition: swaggerCompetition,
    User: swaggerUser,
    CompetitionGroup: swaggerCompetitionGroup,
    Pair: swaggerPair,
    CompetitionBody: swaggerCompetitionBody,
    UserBody: swaggerUserBody,
    CompetitionGroupBody: swaggerCompetitionGroupBody,
    PairBody: swaggerPairBody,
  },
  components: {}, // by default: empty object (OpenAPI 3.x)
};

swaggerAutogen(outputFile, endpointsFiles, doc);
