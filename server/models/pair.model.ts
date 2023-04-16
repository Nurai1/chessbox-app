import mongoose from 'mongoose';

import { IPair } from '../types/index.js';

const { Schema } = mongoose;

export const pairSchema = new Schema<IPair>(
  {
    roundNumber: {
      type: Number,
    },
    blackParticipant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    whiteParticipant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    winner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    passed: {
      type: Boolean,
    },
    order: {
      type: Number,
    },
    calledForPreparation: {
      type: Boolean,
    },
    calledForFight: {
      type: Boolean,
    },
  },
  { versionKey: false }
);
