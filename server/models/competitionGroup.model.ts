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
    lastPlaceNumber: Number,
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
    results: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          identificator: true,
        },
        placeNumber: { type: Number, required: true },
      },
    ],
    passedPairs: [pairSchema],
    currentRoundPairs: [pairSchema],
    isCompleted: { type: Boolean, default: false },
    olympicGrid: {},
  },
  { versionKey: false }
);
