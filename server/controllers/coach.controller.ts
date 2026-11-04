import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { ROLES } from '../constants';
import { User } from '../models';
import { CreateCoachParticipantParser } from '../utils/validation';

export const getCoachParticipants = async (_req: Request, res: Response) => {
  const participants = await User.find({
    coachId: res.locals.loggedInUser._id,
    role: ROLES.PARTICIPANT,
  })
    .select('-hashedPassword -oneTimeCode')
    .sort({ fullName: 1 });

  return res.send(participants);
};

export const createCoachParticipant = async (req: Request, res: Response) => {
  const parsed = CreateCoachParticipantParser.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).send({
      error: 'Validation Error. Some fields do not match requirements.',
      issues: parsed.error.issues,
    });
  }

  const { password, ...profile } = parsed.data;
  const user = new User({
    ...profile,
    fullName: `${profile.firstName} ${profile.lastName}`,
    hashedPassword: await bcrypt.hash(password, 10),
    role: ROLES.PARTICIPANT,
    coachId: res.locals.loggedInUser._id,
    emailConfirmed: true,
    oneTimeCode: null,
    ratingNumber: 1000,
  });

  try {
    await user.save();
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      return res
        .status(409)
        .send({ error: 'An account with this email already exists.' });
    }
    throw error;
  }

  // Creating a pupil never signs the coach out or sends a confirmation email.
  const { hashedPassword, oneTimeCode, ...participant } = user.toObject();
  return res.status(201).send(participant);
};
