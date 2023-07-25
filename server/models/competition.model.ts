import mongoose from 'mongoose';

import { ICompetition } from '../types/index';
import { competitionGroupSchema } from './competitionGroup.model';

const { Schema } = mongoose;

const competitionSchema = new Schema<ICompetition>(
  {
    startDate: { type: Date, required: true },
    endDate: Date,
    registrationEndsAt: { type: Date, required: true },
    name: { type: String, required: true },
    description: String,
    groups: [competitionGroupSchema],
    price: {
      currentValue: Number,
      pricesChanges: [
        {
          daysBeforeRegistrationDate: { type: Number, required: true },
          newValue: { type: Number, required: true },
        },
      ],
    },
    zoomLink: String,
    requirements: {
      ageCategory: {
        from: { type: Number },
        to: { type: Number },
      },
      weightCategory: {
        from: { type: Number },
        to: { type: Number },
      },
      gender: { type: String },
    },
    lastOrder: {
      group: { type: Number, default: 0 },
      pair: { type: Number, default: 0 },
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // info for swagger
        identificator: true,
      },
    ],
    judges: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // info for swagger
        identificator: true,
      },
    ],
  },
  { versionKey: false }
);

export const Competition = mongoose.model('Competition', competitionSchema);
