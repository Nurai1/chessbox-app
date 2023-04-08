/* eslint-disable no-use-before-define */
import { Document, PopulatedDoc, Types } from 'mongoose';

export type ECoefficients = 1 | 0.75 | 0.5 | 0.25;
export type GenderType = 'woman' | 'man';
export type WeightUnitType = 'kg';

export interface Address {
  region: string;
  city?: string;
}

export interface IUser {
  email: string;
  firstName?: string;
  lastName?: string;
  weight?: { number: number; category: string; measureUnit: WeightUnitType };
  hashedPassword: string;
  role: string;
  accessToken?: string;
  username: string;
  birthDate?: string;
  age?: number;
  gender?: GenderType;
  address?: Address;
  club?: string;
  ratingNumber: number;
  competition: PopulatedDoc<ICompetition & Document>;
  currentGroupId?: string;
  competitionsHistory: {
    competitionId: string;
    placeNumber: number;
    groupId: string;
  }[];
}

export interface IPair {
  _id?: Types.ObjectId;
  roundNumber: number;
  blackParticipant?: PopulatedDoc<IUser & Document>;
  whiteParticipant?: PopulatedDoc<IUser & Document>;
  winner?: PopulatedDoc<IUser & Document>;
  passed: boolean;
}

export interface ICompetition {
  _id: Types.ObjectId;
  startDate: string;
  endDate: string;
  name: string;
  description?: string;
  groups: ICompetitionGroup[];
  participants: PopulatedDoc<IUser & Document>[];
}

export interface ICompetitionGroup {
  _id?: Types.ObjectId;
  ageCategory: string;
  weightCategory: string;
  gender: GenderType;
  allParticipants: PopulatedDoc<IUser & Document>[];
  pairs: IPair[];
  currentRoundNumber: number;
  nextRoundParticipants: PopulatedDoc<IUser & Document>[];
}
