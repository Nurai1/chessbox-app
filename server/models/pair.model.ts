import mongoose from 'mongoose';

import { IPair } from '../types/index';

const { Schema } = mongoose;

export const pairSchema = new Schema<IPair>(
  {
    blackParticipant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      // info for swagger
      identificator: true,
    },
    whiteParticipant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      // info for swagger
      identificator: true,
    },
    winner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      // info for swagger
      identificator: true,
    },
    passed: {
      type: Boolean,
    },
    calledForPreparation: {
      type: Boolean,
    },
    acceptedForFight: {
      blackParticipant: Boolean,
      whiteParticipant: Boolean,
    },
    disqualified: {
      blackParticipant: Boolean,
      whiteParticipant: Boolean,
    },
    judge: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      // info for swagger
      identificator: true,
    },
  },
  { versionKey: false }
);
