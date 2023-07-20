import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../models/index';
import ac from '../roles';
import { RESOURCES, ACTIONS } from '../constants';
import { ICompetition } from '../types/index';
import { errorUniqueCheck } from '../utils/errors';
import {
  CreateUserParser,
  emailParser,
  passwordParser,
} from '../utils/validation';

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword: string, hashedPassword: string) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password, ...userData } = req.body;

  const userValidRes = CreateUserParser.safeParse(req.body);

  if (!userValidRes.success) {
    res.status(400).send({
      error: 'Validation Error. Some fields do not match requirements.',
      issues: userValidRes.error.issues,
    });
  }

  const hashedPassword = await hashPassword(password);
  const newUser = new User({
    ...userData,
    role: 'participant',
    fullName: `${userData.firstName} ${userData.lastName}`,
    hashedPassword,
    ratingNumber: 1000,
  });

  const accessToken = jwt.sign(
    { userId: newUser._id },
    process.env.JWT_SECRET_KEY || '',
    { expiresIn: '7d' }
  );

  try {
    await newUser.save();
  } catch (err: any) {
    errorUniqueCheck({ err, res });
  }

  res.json({
    data: newUser,
    accessToken,
  });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new Error('Email does not exist'));

  const validPassword = await validatePassword(password, user.hashedPassword);
  if (!validPassword) return next(new Error('Password is not correct'));

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_KEY || '',
    {
      expiresIn: '7d',
    }
  );

  res.status(200).json({
    accessToken,
    userId: user._id,
  });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const accessToken = req.headers['x-access-token'];

  const { userId } = jwt.decode(accessToken as string) as jwt.JwtPayload;

  const user = await User.findById(userId);
  if (!user)
    return res
      .status(404)
      .send({ error: "User saved in token doesn't exist anymore." });

  res.send(user);
};

export const grantAccess =
  (action: keyof typeof ACTIONS, resource: keyof typeof RESOURCES) =>
  async (_: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.loggedInUser;

      const permission = ac.can(user?.role)[action](resource);

      if (!permission.granted) {
        return res.status(403).json({
          error: "You don't have enough permission to perform this action",
        });
      }

      next();
    } catch (err: any) {
      next(err);
    }
  };

export const allowIfLoggedin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.loggedInUser;

    if (!user)
      return res.status(401).json({
        error: 'You need to be logged in to access this route',
      });

    next();
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request<
    any,
    {
      offset?: string;
      limit?: string;
      search?: string;
      ageFrom?: string;
      ageTo?: string;
      weightFrom?: string;
      weightTo?: string;
      withWomen?: string;
      withMen?: string;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  const {
    offset,
    limit,
    search,
    ageFrom,
    ageTo,
    weightFrom,
    weightTo,
    withWomen,
    withMen,
  } = req.query;

  const getGenderFilter = () => {
    if (withWomen === 'true' && withMen === 'true') {
      return null;
    }
    if (withWomen === 'true') {
      return { gender: 'woman' };
    }
    if (withMen === 'true') {
      return { gender: 'man' };
    }
    return null;
  };

  const allFilters = [
    ageTo && {
      age: { $lte: Number(ageTo) },
    },
    ageFrom && {
      age: { $gte: Number(ageFrom) },
    },
    weightTo && {
      weight: { $lte: Number(weightTo) },
    },
    weightFrom && {
      weight: { $gte: Number(weightFrom) },
    },
    getGenderFilter(),
    search && {
      $or: [
        { 'chessPlatform.username': { $regex: search } },
        { fullName: { $regex: search } },
      ],
    },
  ].filter((val) => {
    return !!val;
  }) as Record<string, any>[];

  const filter =
    allFilters.length > 0
      ? {
          $and: allFilters,
        }
      : {};

  let usersQuery = User.find(filter).populate('competition');
  let usersCount = await User.count(filter);

  const lim = Number(limit);
  const skip = Number(offset);

  if ((limit && isNaN(lim)) || (offset && isNaN(skip))) {
    res.status(400).send({
      error: {
        type: 'Validation error',
        message: 'Users query data for limit or offset are incorrect.',
      },
    });
    return;
  }

  usersQuery = usersQuery.limit(lim).skip(skip);

  const users = await usersQuery.sort({ ratingNumber: 'descending' });

  res.send({ items: users, total: usersCount });
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });

  if (!user) return res.status(404).send({ error: "User wasn't found" });

  res.send(user);
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body) return res.sendStatus(400);

  const user = new User(req.body);

  await user.save();

  res.send(user);
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) return res.status(404).send({ error: "User wasn't found" });

  res.send(user);
};

export const updateCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body) return res.sendStatus(400);
  const result = req.body;

  const accessToken = req.headers['x-access-token'];

  const { userId } = jwt.decode(accessToken as string) as jwt.JwtPayload;

  if (req.body.password) {
    const passwordValidRes = passwordParser.safeParse(req.body.password);

    if (!passwordValidRes.success) {
      res.status(400).send({
        error: 'Password does not match requirements.',
      });
    }
  }

  if (req.body.email) {
    const emailValidRes = emailParser.safeParse(req.body.email);

    if (!emailValidRes.success) {
      res.status(400).send({
        error: 'Email does not match requirements.',
      });
    }
  }

  const updatedUser = await User.findOneAndUpdate({ _id: userId }, result, {
    new: true,
  });

  if (!updatedUser) return res.status(404).send({ error: "User wasn't found" });

  res.send(updatedUser);
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body) return res.sendStatus(400);
  const result = req.body;

  if (req.body.password) {
    const passwordValidRes = passwordParser.safeParse(req.body.password);

    if (!passwordValidRes.success) {
      res.status(400).send({
        error: 'Password does not match requirements.',
      });
    }
  }

  if (req.body.email) {
    const emailValidRes = emailParser.safeParse(req.body.email);

    if (!emailValidRes.success) {
      res.status(400).send({
        error: 'Email does not match requirements.',
      });
    }
  }

  const user = await User.findOneAndUpdate({ _id: result._id }, result, {
    new: true,
  });

  if (!user) return res.status(404).send({ error: "User wasn't found" });

  res.send(user);
};

export const getUserCurrentPair = async (
  req: Request<{ id?: string }>,
  res: Response,
  next: NextFunction
) => {
  const { id: userId } = req.params;
  if (!userId) return res.status(400).send({ error: 'No user id was sent.' });

  const user = await User.findOne({ _id: userId }).populate('competition');
  if (!user) return res.status(404).send({ error: "User wasn't found" });

  const competition = user?.competition as ICompetition;

  const currentUserGroup = competition?.groups?.find(
    (g) => g._id?.toString() === user?.currentGroupId
  );

  if (
    currentUserGroup?.nextRoundParticipants?.find(
      (participant) => participant._id?.toString() === userId
    )
  ) {
    res.send({ pair: null, roundDivider: null });
  }

  const pair = currentUserGroup?.currentRoundPairs?.find(
    (p) =>
      p.blackParticipant?.toString() === userId ||
      p.whiteParticipant?.toString() === userId
  );

  if (!pair) {
    return res.status(404).send({ error: "Pair wasn't found" });
  }

  res.send({
    pair: pair,
    roundDivider: currentUserGroup?.nextRoundParticipants.length
      ? null
      : currentUserGroup?.currentRoundPairs?.length,
  });
};
