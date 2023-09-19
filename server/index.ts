import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cors from 'cors';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as swaggerUi from 'swagger-ui-express';
import { WebSocketServer } from 'ws';
import expressWsExec from 'express-ws';
import * as swaggerFile from './swagger_output.json';
import { User } from './models/index';
import { competitionRouter, userRouter } from './routes/index';

export const app = express();
const expressWs = expressWsExec(app);

const { TokenExpiredError } = jwt;

dotenv.config();

const remoteMongoUri = process.env.MONGO_URI;
const { JWT_SECRET_KEY, ENVIRONMENT } = process.env;

const PORT = Number(process.env.PORT) || 8080;
const HOST = ENVIRONMENT === 'development' ? 'localhost' : '0.0.0.0';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (ENVIRONMENT === 'development')
  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(
  cors({
    origin: '*',
  })
);

app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

mongoose.set('strictQuery', 'throw');

mongoose.connect(remoteMongoUri ?? '', (err) => {
  if (err) {
    console.log(err);
  }
});

const { connection } = mongoose;
connection.once('open', () => {
  const mongoEnv = remoteMongoUri?.slice(
    remoteMongoUri.lastIndexOf('mongodb.net/') + 'mongodb.net/'.length,
    remoteMongoUri.lastIndexOf('?retryWrites=true&w=majority')
  );
  console.log(
    'MongoDB database connection established successfully on mongo env: ',
    mongoEnv
  );
});

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers['x-access-token'];

    if (accessToken) {
      let userId;

      try {
        const { userId: tokenUserId } = jwt.verify(
          accessToken as string,
          JWT_SECRET_KEY || ''
        ) as jwt.JwtPayload;

        userId = tokenUserId;
      } catch (err: any) {
        if (err instanceof TokenExpiredError) {
          return res.status(401).json({
            error: 'Your session has expired, please login to obtain a new one',
          });
        }
      }

      res.locals.loggedInUser = await User.findById(userId);
    }

    next();
  } catch (err) {
    next(err);
  }
});

app.use('/api', competitionRouter);

app.use('/api', userRouter);

// @ts-ignore
app.ws('/api', (ws, req) => {
  // @ts-ignore
  ws.on('message', (msg) => {
    console.log(msg);
    ws.send(`We got your message: ${msg}`);
  });
  console.log('socket', req.testing);
});

app.use((err: any, req: Request, res: Response) => {
  // TODO: after adding ws, error handling approximately is not working
  console.error('ERROR STACK:');
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
