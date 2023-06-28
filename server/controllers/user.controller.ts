import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../models/index';
import ac from '../roles';
import { RESOURCES, ACTIONS } from '../constants';
import { IUser } from '../types/index';
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
  });
};

interface IGrantAcessReq extends Request {
  user: IUser;
}

export const grantAccess =
  (action: keyof typeof ACTIONS, resource: keyof typeof RESOURCES) =>
  async (_: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.loggedInUser;

      const permission = ac.can(user?.role)[action](resource);

      if (!permission.granted) {
        return res.status(401).json({
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
  req: Request<any, { offset?: string; limit?: string; search?: string }>,
  res: Response,
  next: NextFunction
) => {
  const { offset, limit, search } = req.query;

  const filter = search
    ? {
        $or: [
          { chessPlatform: { username: { $regex: search } } },
          { email: { $regex: search } },
          { fullName: { $regex: search } },
        ],
      }
    : {};

  let usersQuery = User.find(filter).populate('competition');
  let usersCount = await User.count({});

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

  res.send(user);
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
  console.log(user);

  res.send(user);
};
