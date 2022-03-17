import mongoose from 'mongoose';

import { IPair } from '../types/index.js';

const { Schema } = mongoose;

const pairSchema = new Schema<IPair>(
  {
    number: {
      type: Number,
      required: true,
    },
    blackParticipant: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    whiteParticipant: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    winner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    chessWin: Boolean,
    boxingRounds: [{
      type: Schema.Types.ObjectId,
      ref: 'BoxingRound'
    }],
    competition: {
      type: Schema.Types.ObjectId,
      ref: 'Competition'
    },
  },
  { versionKey: false }
);

export const Pair = mongoose.model('Pair', pairSchema);
