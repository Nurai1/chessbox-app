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
    chessPlatform: {
      username: {
        type: String,
        required: true,
      },
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
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
    passwordResetCode: { type: Number },
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
