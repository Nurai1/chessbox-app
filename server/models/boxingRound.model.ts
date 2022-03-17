import mongoose from 'mongoose';

import { IBoxingRound } from '../types/index.js';

const { Schema } = mongoose;

const boxingRoundSchema = new Schema<IBoxingRound>(
  {
    order: {
      type: Number,
      required: true
    },
    pair: {
      type: Schema.Types.ObjectId,
      ref: 'Pair'
    },
    blackSide: {
      amountOfHits: Number,
      coefficient: Number,
      points: Number,
    },
    whiteSide: {
      amountOfHits: Number,
      coefficient: Number,
      points: Number,
    },
    winner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    judge: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
  },
  { versionKey: false }
);

export const BoxingRound = mongoose.model('BoxingRound', boxingRoundSchema);
