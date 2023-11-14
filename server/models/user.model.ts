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
    fightClub: { name: { type: String } },
    role: {
      type: String,
      required: true,
      enum: ['participant', 'judge', 'chief_judge', 'admin'],
    },
    birthDate: { type: Date },
    socialNetworks: {
      whatsup: String,
    },
    gender: { type: String, enum: ['woman', 'man'] },
    ratingNumber: { type: Number },
    weight: { type: Number },
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
