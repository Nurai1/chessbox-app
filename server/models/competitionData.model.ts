import mongoose from 'mongoose';

import { Binary } from 'mongodb';

const { Schema } = mongoose;

export interface ICompetitionData {
  competitionId: string;
  banner: { name: string; image: Binary };
}

const competitionDataSchema = new Schema<ICompetitionData>(
  {
    competitionId: { type: String, required: true, unique: true },
    banner: { name: String, image: Schema.Types.Mixed },
  },
  { versionKey: false }
);

export const CompetitionData = mongoose.model(
  'CompetitionData',
  competitionDataSchema
);
