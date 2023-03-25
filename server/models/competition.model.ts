import mongoose from 'mongoose';

import { ICompetition } from '../types/index.js';
import { competitionGroupSchema } from './competitionGroup.model.js';

const { Schema } = mongoose;

const competitionSchema = new Schema<ICompetition>(
  {
    startDate: Date,
    endDate: Date,
    name: { type: String, required: true },
    description: String,
    groups: [competitionGroupSchema],
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { versionKey: false }
);

export const Competition = mongoose.model('Competition', competitionSchema);
