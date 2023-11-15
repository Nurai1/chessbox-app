/* eslint-disable no-use-before-define */
import { Document, PopulatedDoc, Types } from 'mongoose';

export type ECoefficients = 1 | 0.75 | 0.5 | 0.25;
export type GenderType = 'woman' | 'man';
export type Category = {
  from: number;
  to: number;
};

export interface Address {
  country: string;
  city: string;
}

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  weight: number;
  hashedPassword: string;
  role: string;
  chessPlatform: {
    username: string;
  };
  socialNetworks?: {
    whatsUp?: string;
  };
  birthDate: Date;
  gender: GenderType;
  address: Address;
  fightClub: { name: string };
  ratingNumber: number;
  passwordResetCode: number | null;
  currentGroupId?: string;
  competitionsHistory: {
    competitionId: string;
    placeNumber: number;
    groupId: string;
  }[];
}

export interface IPair {
  _id?: Types.ObjectId;
  blackParticipant?: PopulatedDoc<IUser & Document>;
  whiteParticipant?: PopulatedDoc<IUser & Document>;
  winner?: PopulatedDoc<IUser & Document>;
  passed: boolean;
  calledForPreparation?: boolean;
  acceptedForFight?: {
    blackParticipant?: boolean;
    whiteParticipant?: boolean;
  };
  disqualified?: {
    blackParticipant?: boolean;
    whiteParticipant?: boolean;
  };
  judge?: PopulatedDoc<IUser & Document>;
}

export interface ICompetition {
  _id: Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  registrationEndsAt: Date;
  name: string;
  description?: string;
  price?: {
    currentValue?: number;
    pricesChanges?: {
      daysBeforeRegistrationDate: number;
      newValue: number;
    }[];
  };
  zoomLink?: string;
  started?: boolean;
  chiefJudgeEndedConfiguration?: boolean;
  breakTime?: {
    minutes?: number;
  };
  requirements?: {
    ageCategory?: Category;
    weightCategory?: Category;
    gender?: GenderType;
  };
  groups: ICompetitionGroup[];
  participants: PopulatedDoc<IUser & Document>[];
  judges: PopulatedDoc<IUser & Document>[];
  usersPaymentInfo?: {
    userId: string;
    paid: boolean;
    requestedToCheck: boolean;
    requestedCount: number;
    message?: string;
  }[];
}

export interface ICompetitionGroup {
  _id?: Types.ObjectId;
  ageCategory: string;
  weightCategory: string;
  gender: GenderType;
  allParticipants: PopulatedDoc<IUser & Document>[];
  passedPairs: IPair[];
  currentRoundPairs: IPair[];
  currentRoundNumber: number;
  order?: number;
  nextRoundParticipants: PopulatedDoc<IUser & Document>[];
  results?: { userId: PopulatedDoc<IUser & Document>; placeNumber: number }[];
  isCompleted?: boolean;
}
