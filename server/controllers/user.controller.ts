import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { User } from '../models/index';
import ac from '../roles';
import { RESOURCES, ACTIONS } from '../constants';
import { IUser } from '../types/index';
import { errorUniqueCheck } from '../utils/errors';

const emailParser = z.string().email().min(5);
const passwordParser = z.string().min(4 /* 8 */);
const UserParser = z.object({
  email: emailParser,
  password: passwordParser,
});

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
  const { username, email, password, role } = req.body;

  const userValidRes = UserParser.safeParse(req.body);

  if (!userValidRes.success) {
    res.status(400).send({
      error: {
        message: 'Validation Error',
        issues: userValidRes.error.issues,
      },
    });
  }

  const hashedPassword = await hashPassword(password);
  const newUser = new User({
    email,
    username,
    hashedPassword,
    role: role || 'participant',
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await User.find({}).populate('competition');

  res.send(users);
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
        error: {
          message: 'Validation Error',
          issues: passwordValidRes.error.issues,
        },
      });
    }
  }

  if (req.body.email) {
    const emailValidRes = emailParser.safeParse(req.body.email);

    if (!emailValidRes.success) {
      res.status(400).send({
        error: {
          message: 'Validation Error',
          issues: emailValidRes.error.issues,
        },
      });
    }
  }

  const user = await User.findOneAndUpdate({ _id: result._id }, result, {
    new: true,
  });
  console.log(user);

  res.send(user);
};
