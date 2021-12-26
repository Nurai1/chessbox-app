import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/user';

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
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
    name: { type: String, required: true },
    age: Number,
  },
  { versionKey: false }
);

export const User = mongoose.model('User', userSchema);
