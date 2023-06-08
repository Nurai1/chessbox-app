import mongoose from 'mongoose';

import { ICompetition } from '../types/index';
import { competitionGroupSchema } from './competitionGroup.model';

const { Schema } = mongoose;

const competitionSchema = new Schema<ICompetition>(
  {
    startDate: Date,
    endDate: Date,
    name: { type: String, required: true },
    description: String,
    groups: [competitionGroupSchema],
    participantsAmount: Number,
    lastOrder: {
      group: { type: Number, default: 0 },
      pair: { type: Number, default: 0 },
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    judges: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { versionKey: false }
);

export const Competition = mongoose.model('Competition', competitionSchema);
