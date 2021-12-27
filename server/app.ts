import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import routes from './routes.js';
import { User } from './models/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();

const { JWT_SECRET_KEY } = process.env;

const PORT = process.env.PORT || 3000;

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

app.use(express.static(`${__dirname}/public`));

mongoose.connect('mongodb://localhost:27017/test', (err) => {
  if (err) {
    console.log(err);
  }

  // app.listen(PORT, () => {
  //   console.log(`Server is started on port: ${PORT}`);
  // });
});

app.use(async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers['x-access-token'];

  if (accessToken) {
    const { userId, exp } = jwt.verify(
      accessToken as string,
      JWT_SECRET_KEY || ''
    ) as jwt.JwtPayload;

    if ((exp || 0) < Date.now().valueOf() / 1000) {
      return res.status(401).json({
        error: 'Your session has expired, please login to obtain a new one',
      });
    }

    res.locals.loggedInUser = await User.findById(userId);
    next();
  } else {
    next();
  }
});

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is started on port: ${PORT}`);
});
