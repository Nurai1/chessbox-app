import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { ROLES } from '../constants';
import { User } from '../models';
import { CreateCoachParticipantParser } from '../utils/validation';

export const getCoachParticipants = async (req: Request, res: Response) => {
  const { search = '', offset = '0' } = req.query;
  if (
    typeof search !== 'string' ||
    search.length > 100 ||
    typeof offset !== 'string' ||
    !/^\d+$/.test(offset) ||
    !Number.isSafeInteger(Number(offset))
  ) {
    return res.status(400).send({ error: 'Invalid participant search.' });
  }

  const tokens = search.trim().split(/\s+/).filter(Boolean);
  const filter = {
    role: ROLES.PARTICIPANT,
    emailConfirmed: true,
    ...(tokens.length
      ? {
          $and: tokens.map((token) => {
            const pattern = new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            return { $or: [{ firstName: pattern }, { lastName: pattern }] };
          }),
        }
      : {}),
  };
  const [participants, total] = await Promise.all([
    User.find(filter)
      .select('_id firstName lastName fullName birthDate weight gender address')
      .sort({ fullName: 1, _id: 1 })
      .skip(Number(offset))
      .limit(20),
    User.countDocuments(filter),
  ]);

  return res.send({ items: participants, total });
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
