import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models/index.js';
import ac from '../roles.js';
import { RESOURCES, ACTIONS } from '../constants.js';
import { IUser } from '../types/index.js';

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
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || 'guest',
    });

    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY || '',
      { expiresIn: '1h' }
    );

    newUser.accessToken = accessToken;

    await newUser.save();

    res.json({
      data: newUser,
      accessToken,
    });
  } catch (err: any) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next(new Error('Email does not exist'));

    const validPassword = await validatePassword(password, user.hashedPassword);
    if (!validPassword) return next(new Error('Password is not correct'));

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || '',
      {
        expiresIn: '1h',
      }
    );
    await User.findByIdAndUpdate(user._id, { accessToken });

    res.status(200).json({
      data: {
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (err: any) {
    next(err);
  }
};

interface IGrantAcessReq extends Request {
  user: IUser;
}

export const grantAccess =
  (action: keyof typeof ACTIONS, resource: keyof typeof RESOURCES) =>
  async (req: Request, res: Response, next: NextFunction) => {
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

    // @ts-ignore
    next();
  } catch (error) {
    next(error);
  }
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({}, (err: any, users: IUser[]) => {
    if (err) return console.log(err);
    res.send(users);
  });
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  User.findOne({ _id: id }, (err: any, user: IUser | null) => {
    if (err) return console.log(err);
    res.send(user);
  });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) return res.sendStatus(400);

  const userName = req.body.name;
  const userAge = req.body.age;
  const user = new User({ name: userName, age: userAge });

  user.save((err: any) => {
    if (err) return console.log(err);
    res.send(user);
  });
};

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  User.findByIdAndDelete(id, (err: any, user: IUser | null) => {
    if (err) return console.log(err);
    res.send(user);
  });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) return res.sendStatus(400);
  const { id } = req.body;
  const userName = req.body.name;
  const userAge = req.body.age;
  const newUser = { age: userAge, name: userName };

  User.findOneAndUpdate(
    { _id: id },
    newUser,
    { new: true, rawResult: true },
    (err: any, user: IUser) => {
      if (err) return console.log(err);
      res.send(user);
    }
  );
};
