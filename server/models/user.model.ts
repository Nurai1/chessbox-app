import mongoose from 'mongoose';

import { IUser } from '../types/index';

const { Schema } = mongoose;

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      default: 'guest',
      enum: ['guest', 'participant', 'judge', 'chief_judge', 'admin'],
    },
    username: { type: String, required: true, unique: true },
    age: Number,
    socialNetworks: {
      whatsup: String,
    },
    gender: String,
    birthDate: Date,
    ratingNumber: { type: Number, required: true },
    weight: { number: Number, category: String, measureUnit: String },
    competition: {
      type: Schema.Types.ObjectId,
      ref: 'Competition',
      // info for swagger
      identificator: true,
    },
    currentGroupId: String,
    competitionsHistory: [
      {
        competitionId: String,
        groupId: String,
        placeNumber: Number,
      },
    ],
  },
  { versionKey: false }
);

export const User = mongoose.model('User', userSchema);
