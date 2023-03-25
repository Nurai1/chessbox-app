import mongoose from 'mongoose';

import { ICompetitionGroup } from '../types/index.js';
import { pairSchema } from './pair.model.js';

const { Schema } = mongoose;

export const competitionGroupSchema = new Schema<ICompetitionGroup>(
  {
    ageCategory: { type: String, required: true },
    weightCategory: { type: String, required: true },
    gender: { type: String, required: true },
    currentRoundNumber: { type: Number, required: true },
    nextRoundParticipants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    allParticipants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    pairs: [pairSchema],
  },
  { versionKey: false }
);
