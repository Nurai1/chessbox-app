import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import serverless from 'serverless-http';

import { userRouter, competitionRouter } from './routes/index';
import { User } from './models/index';

const remoteMongoUri =
  'mongodb+srv://bllndman:M%40%40nAtlasR4y@chessboxingbetacluster.ed9q7tj.mongodb.net/test?retryWrites=true&w=majority';

const { TokenExpiredError } = jwt;

// const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();

const { JWT_SECRET_KEY } = process.env;

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// app.use(express.static(`${__dirname}/public`));

mongoose.set('strictQuery', true);

mongoose.connect(remoteMongoUri, (err) => {
  if (err) {
    console.log(err);
  }
});

const { connection } = mongoose;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
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

app.use('/api', userRouter);
app.use('/api', competitionRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  res.status(500).send({ error: err.message });
});

if (process.env.ENVIRONMENT !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is started on port: ${PORT}`);
  });
}

export const handler = process.env.ENVIRONMENT === 'production' && serverless(app);
