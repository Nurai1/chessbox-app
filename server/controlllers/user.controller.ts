import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { Competition, User } from '../models/index.js';
import ac from '../roles.js';
import { RESOURCES, ACTIONS } from '../constants.js';
import { IUser } from '../types/index.js';
import { errorUniqueCheck } from '../utils/errors.js';
import {
  getWeightCategoryForUnder11YearsOld,
  getWeightCategoryFor12And13YearsOld,
  getWeightCategoryFor14And15YearsOldMan,
  getWeightCategoryFor14And15YearsOldWoman,
  getWeightCategoryFor16And17YearsOld,
  getWeightCategoryFor18To40YearsOldMan,
  getWeightCategoryFor18To40YearsOldWoman,
  getWeightCategoryForAbove40YearsOldMan,
  getWeightCategoryForAbove40YearsOldWoman,
} from '../utils/weightCategory.js';

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

  newUser.accessToken = accessToken;

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
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { accessToken },
    { new: true }
  );

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

  const userName = req.body.name;
  const userAge = req.body.age;
  const user = new User({ name: userName, age: userAge, ratingNumber: 1000 });

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
    const passwordValidRes = emailParser.safeParse(req.body.password);

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

  // if (req.body.weight) {
  //   let weightCategory;

  //   const {
  //     weight: { number },
  //     age,
  //     gender,
  //   } = req.body;
  //   if (age < 12) {
  //     weightCategory = getWeightCategoryForUnder11YearsOld(number);
  //   } else if (age === 12 || age === 13) {
  //     weightCategory = getWeightCategoryFor12And13YearsOld(number);
  //   } else if ((age === 14 || age === 15) && gender === 'man') {
  //     weightCategory = getWeightCategoryFor14And15YearsOldMan(number);
  //   } else if ((age === 14 || age === 15) && gender === 'woman') {
  //     weightCategory = getWeightCategoryFor14And15YearsOldWoman(number);
  //   } else if (age === 16 || age === 17) {
  //     weightCategory = getWeightCategoryFor16And17YearsOld(number);
  //   } else if ((age > 17 || age <= 40) && gender === 'man') {
  //     weightCategory = getWeightCategoryFor18To40YearsOldMan(number);
  //   } else if ((age > 17 || age <= 40) && gender === 'woman') {
  //     weightCategory = getWeightCategoryFor18To40YearsOldWoman(number);
  //   } else {
  //     weightCategory =
  //       gender === 'man'
  //         ? getWeightCategoryForAbove40YearsOldMan(number)
  //         : getWeightCategoryForAbove40YearsOldWoman(number);
  //   }

  //   result = {
  //     ...result,
  //     weight: { number, measureUnit: 'kg', category: weightCategory },
  //   };
  // }

  const { id } = req.body;

  const user = await User.findOneAndUpdate({ _id: id }, result, {
    new: true,
  });

  res.send(user);
};
