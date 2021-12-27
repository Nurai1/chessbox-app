import mongoose from 'mongoose';

import { IFight } from '../types/index.js';

const { Schema } = mongoose;

const fightSchema = new Schema<IFight>(
  {
    participants: {
      type: Schema.Types.ObjectId,
      ref: 'Users'
    },
    winner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    prevFight: {
      type: Schema.Types.ObjectId,
      ref: 'Fight'
    },
    nextFight: {
      type: Schema.Types.ObjectId,
      ref: 'Fight'
    },
  },
  { versionKey: false }
);

export const User = mongoose.model('Fight', fightSchema);
