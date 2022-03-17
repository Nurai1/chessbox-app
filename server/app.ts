import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { userRouter } from './routes/index.js';
import { User, Pair } from './models/index.js';
import { IPair, IUser } from './types/index.js';

const { TokenExpiredError } = jwt;

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

app.use(async function(req: Request, res: Response, next: NextFunction) {
  try {
  //   const accessToken = req.headers['x-access-token'];
    
  //   if (accessToken) {
  //     let userId;

  //     try {
  //       const { userId: tokenUserId } = jwt.verify(
  //         accessToken as string,
  //         JWT_SECRET_KEY || ''
  //       ) as jwt.JwtPayload;

  //       userId = tokenUserId;
  //     } catch(err: any) {
  //       if (err instanceof TokenExpiredError) {
  //         return res.status(401).json({
  //           error: 'Your session has expired, please login to obtain a new one',
  //         });
  //       }
  //     }

  //     res.locals.loggedInUser = await User.findById(userId);
  // }

    // убрать ниже
    res.locals
    .loggedInUser = await User.findById("621abf0b0ef9be86a3f00e6f"); // part
    // res.locals
    // .loggedInUser = await User.findById("620ed426956aeb52b3ed12ae"); // admin
  next();
  } catch (err) {
    next(err);
  }
});

app.use('/api', userRouter);

app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);

  res.status(500).send({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is started on port: ${PORT}`);
});

// app.get('/createPair', async (req, res) => {
//   const pair = new Pair({   number: 1,
//     blackParticipant: "620ed426956aeb52b3ed12ae",
//     whiteParticipant: "620ed42a956aeb52b3ed12b0",
//     boxingRounds: [],
//    });
//    console.log('pair', pair);
   

//    User.findOneAndUpdate(
//     { _id: "620ed426956aeb52b3ed12ae" },
//     {pair: pair._id},
//     { new: true, rawResult: true },
//     (err: any, user: IUser) => {
//       if (err) res.send(err);
//     }
//   );

//   User.findOneAndUpdate(
//     { _id: "620ed42a956aeb52b3ed12b0" },
//     {pair: pair._id},
//     { new: true, rawResult: true },
//     (err: any, user: IUser) => {
//       if (err) res.send(err);
//     }
//   );

//   await pair.save();
// });

// app.get('/deletap', async (req, res) => {
//    Pair.findByIdAndDelete("621aa457e4691109317e75f3", (err: any)=> {
//      console.log('err', err);
//    })
// });

// app.get('/users', async (req, res) => {
//   User.find({})  .populate('pair')
//   .exec(function (err, users) {
//     if (err) res.send(err);
//     res.send(users);
//   });
// });

// app.get('/pairs', async (req, res) => {
//   Pair.find({})
//   .populate('blackParticipant')
//   .populate('whiteParticipant')
//   .exec(function (err, pairs) {
//     if (err) res.send(err);
//     res.send(pairs);
//   });
// });