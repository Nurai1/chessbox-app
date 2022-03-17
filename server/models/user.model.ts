import mongoose from 'mongoose';

import { IUser } from '../types/index.js';

const { Schema } = mongoose;

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique : true,
      required: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'guest',
      enum: ['guest', 'participant', 'judge', 'admin'],
    },
    accessToken: {
      type: String,
    },
    username: { type: String, required: true, unique : true, },
    age: Number,
    pair: {
      type: Schema.Types.ObjectId,
      ref: 'Pair'
    },
  },
  { versionKey: false }
);

export const User = mongoose.model('User', userSchema);
