import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import dayjs from 'dayjs';
import { ACTIONS, RESOURCES, ROLES } from '../constants';
import { User } from '../models/index';
import ac from '../roles';
import { IUser } from '../types/index';
import { getUTCFormattedDate } from '../utils/datetime';
import { errorUniqueCheck } from '../utils/errors';
import {
  CreateUserParser,
  emailParser,
  passwordParser,
} from '../utils/validation';

dotenv.config();

const { CLIENT_URL } = process.env;

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword: string, hashedPassword: string) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export const changePassword = async (req: Request, res: Response) => {
  const { email, passwordResetCode, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).send({ error: "User wasn't found by email" });

  if (user.passwordResetCode === null) {
    return res
      .status(400)
      .send({ error: 'Password Reset Link was timed out.' });
  }

  if (user.passwordResetCode !== passwordResetCode) {
    return res
      .status(400)
      .send({ error: 'Password Reset Code does not match.' });
  }

  const newHashedPassword = await hashPassword(newPassword);
  await User.findOneAndUpdate(
    { email },
    { hashedPassword: newHashedPassword },
    { new: true }
  );

  res.sendStatus(200);
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Yandex',
    auth: {
      user: 'kroshkaothleba@yandex.ru',
      pass: 'Zaq!polk',
    },
  });

  const passwordResetCode = Math.floor(Math.random() * 9000 + 1000);

  const user = await User.findOneAndUpdate(
    { email },
    { passwordResetCode },
    { new: true }
  );
  if (!user)
    return res.status(404).send({ error: "User wasn't found by email" });

  const mailOptions = {
    from: 'kroshkaothleba@yandex.ru',
    to: email,
    subject: 'Chessboxing Online. Password Reset',
    text: `Follow this link to reset your password: \n${CLIENT_URL}/?email=${encodeURIComponent(
      email
    )}&passwordResetCode=${passwordResetCode}#/change-password`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    res.status(500).send({ error: 'Email service does not send email.' });
  }

  setTimeout(async () => {
    await User.findOneAndUpdate(
      { email },
      { passwordResetCode: null },
      { new: true }
    );
  }, 300000);

  res.sendStatus(200);
};

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
    { userId: newUser._id, hashedPassword },
    process.env.JWT_SECRET_KEY || '',
    { expiresIn: '7d' }
  );

  try {
    await newUser.save();
  } catch (err: any) {
    errorUniqueCheck({ err, res });

    throw err;
  }

  res.json({
    data: newUser,
    accessToken,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(400)
      .send({ error: 'User with the email does not exist.' });

  const validPassword = await validatePassword(password, user.hashedPassword);
  if (!validPassword)
    return res.status(400).send({ error: 'Password is not correct' });

  const accessToken = jwt.sign(
    { userId: user._id, hashedPassword: user.hashedPassword },
    process.env.JWT_SECRET_KEY || '',
    {
      expiresIn: '7d',
    }
  );

  res.status(200).json({
    accessToken,
    data: user,
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
    const accessToken = req.headers['x-access-token'];

    if (!user)
      return res.status(401).json({
        error: 'You need to be logged in to access this route',
      });

    const { hashedPassword } = jwt.decode(
      accessToken as string
    ) as jwt.JwtPayload;

    if (user.hashedPassword !== hashedPassword) {
      return res.status(401).json({
        error: 'You password is old. Please, login again.',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const getAllJudges = async (req: Request, res: Response) => {
  const judges = await User.find({ role: ROLES.JUDGE });

  res.send(judges);
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
      role?: string;
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
    role,
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
  const currentYear = dayjs().year();
  const currentYearDate = dayjs(0).set('year', currentYear);

  const ageFromDate = getUTCFormattedDate(
    currentYearDate.subtract(Number(ageFrom), 'year')
  );
  const ageToDate = getUTCFormattedDate(
    currentYearDate.subtract(Number(ageTo), 'year')
  );

  const allFilters = [
    ageTo && {
      birthDate: { $gte: new Date(ageToDate) },
    },
    ageFrom && {
      birthDate: { $lte: new Date(ageFromDate) },
    },
    weightTo && {
      weight: { $lte: Number(weightTo) },
    },
    weightFrom && {
      weight: { $gte: Number(weightFrom) },
    },
    role && {
      role,
    },
    getGenderFilter(),
    search && {
      $or: [
        { 'chessPlatform.username': { $regex: search } },
        { fullName: { $regex: search } },
      ],
    },
  ].filter((val) => !!val) as Record<string, any>[];

  const filter =
    allFilters.length > 0
      ? {
          $and: allFilters,
        }
      : {};

  let usersQuery = User.find(filter);
  const usersCount = await User.count(filter);

  const lim = Number(limit);
  const skip = Number(offset);

  if ((limit && Number.isNaN(lim)) || (offset && Number.isNaN(skip))) {
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
  req: Request<any, any, { user: IUser; password: string }>,
  res: Response,
  next: NextFunction
) => {
  if (!req.body) return res.sendStatus(400);

  const hashedPassword = await hashPassword(req.body.password);

  const newUser = {
    ...req.body.user,
    hashedPassword,
  };
  const user = new User(newUser);

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

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { ...result, fullName: `${result.firstName} ${result.lastName}` },
    {
      new: true,
    }
  );

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
