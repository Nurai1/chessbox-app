import mongoose from 'mongoose';

import { ICompetitionGroup } from '../types/index';
import { pairSchema } from './pair.model';

const { Schema } = mongoose;

export const competitionGroupSchema = new Schema<ICompetitionGroup>(
  {
    ageCategory: {
      from: { type: Number, required: true },
      to: { type: Number, required: true },
    },
    weightCategory: {
      from: { type: Number, required: true },
      to: { type: Number, required: true },
    },
    gender: { type: String, required: true },
    currentRoundNumber: { type: Number, required: true },
    order: { type: Number },
    nextRoundParticipants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // info for swagger
        identificator: true,
      },
    ],
    allParticipants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        identificator: true,
      },
    ],
    passedPairs: [pairSchema],
    currentRoundPairs: [pairSchema],
  },
  { versionKey: false }
);
