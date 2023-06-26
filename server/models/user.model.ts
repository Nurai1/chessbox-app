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
    address: {
      country: { type: String, required: true },
      city: { type: String, required: true },
    },
    fightClub: { name: { type: String, required: true } },
    role: {
      type: String,
      required: true,
      enum: ['participant', 'judge', 'chief_judge', 'admin'],
    },
    username: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    socialNetworks: {
      whatsup: String,
    },
    gender: { type: String, required: true, enum: ['woman', 'man'] },
    ratingNumber: { type: Number, required: true },
    weight: { type: Number, required: true },
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
