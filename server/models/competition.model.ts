import mongoose from 'mongoose';

import { ICompetition } from '../types/index.js';

const { Schema } = mongoose;

const competitionSchema = new Schema<ICompetition>(
  {
    startDate: Date,
    endDate: Date,
    name: String
  },
  { versionKey: false }
);

export const Competition = mongoose.model('Competition', competitionSchema);
