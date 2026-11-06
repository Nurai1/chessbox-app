// eslint-disable-next-line import/no-extraneous-dependencies
import swaggerAutogenInit from 'swagger-autogen';
import mongoose from 'mongoose';
import {
  Competition,
  User,
  competitionGroupSchema,
  pairSchema,
} from './models';

// eslint-disable-next-line import/no-extraneous-dependencies
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
const swaggerUserBody = m2s(User, { ...m2sOptions, omitFields: ['_id'] });
const swaggerPairBody = m2s(mongoose.model('Pair', pairSchema), {
  ...m2sOptions,
  omitFields: ['_id'],
});
const swaggerCompetitionBody = m2s(Competition, {
  ...m2sOptions,
  omitFields: ['_id'],
});
const swaggerCompetitionGroupBody = m2s(
  mongoose.model('CompetitionGroup', competitionGroupSchema),
  {
    ...m2sOptions,
    omitFields: ['_id'],
  }
);
const swaggerCompetitionGroup = m2s(
  mongoose.model('CompetitionGroup', competitionGroupSchema),
  m2sOptions
);
const swaggerPair = m2s(mongoose.model('Pair', pairSchema), m2sOptions);

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
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header', // can be 'header', 'query' or 'cookie'
      name: 'x-access-token', // name of the header, query parameter or cookie
      description: 'Access Token for Discovery UI',
    },
  },
  '@definitions': {
    CoachParticipantPublic: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        fullName: { type: 'string' },
        birthDate: { type: 'string', format: 'date-time' },
        weight: { type: 'number' },
        gender: { type: 'string' },
        address: {
          type: 'object',
          properties: { country: { type: 'string' }, city: { type: 'string' } },
        },
      },
    },
    CoachParticipantInput: {
      type: 'object',
      required: [
        'email',
        'password',
        'firstName',
        'lastName',
        'weight',
        'birthDate',
        'gender',
        'chessPlatform',
        'address',
        'fightClub',
      ],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        weight: { type: 'number' },
        birthDate: { type: 'string' },
        gender: { type: 'string', description: 'woman or man' },
        chessPlatform: {
          type: 'object',
          required: ['username'],
          properties: { username: { type: 'string' } },
        },
        address: {
          type: 'object',
          required: ['country', 'city'],
          properties: { country: { type: 'string' }, city: { type: 'string' } },
        },
        fightClub: {
          type: 'object',
          required: ['name'],
          properties: { name: { type: 'string' } },
        },
      },
    },
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
