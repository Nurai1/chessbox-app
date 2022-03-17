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
    const { username, email, password, role } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      email,
      username,
      hashedPassword,
      role: role || 'participant',
    });

    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY || '',
      { expiresIn: '7d', }
    );

    newUser.accessToken = accessToken;

    await newUser.save();

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
    const updatedUser = await User.findByIdAndUpdate(user._id, { accessToken }, { new: true });

    res.status(200).json({
      data: updatedUser,
      accessToken,
    });
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

    next();
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const users = await User.find({});

  res.send(users);
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });

  res.send(user);
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) return res.sendStatus(400);

  const userName = req.body.name;
  const userAge = req.body.age;
  const user = new User({ name: userName, age: userAge });

  await user.save();

  res.send(user);
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  res.send(user);
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) return res.sendStatus(400);
  const { id } = req.body;
  const userName = req.body.name;
  const userAge = req.body.age;
  const newUser = { age: userAge, name: userName };

  const user = await User.findOneAndUpdate(
    { _id: id },
    newUser,
    { new: true, rawResult: true }
  );

  res.send(user);
};
