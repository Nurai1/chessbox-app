export type ECoefficients = 1 | 0.75 | 0.5 | 0.25;
export type EBoxingRoundOrder = 1 | 3;

interface ISide {
  amountOfHits?: number;
  coefficient?: ECoefficients;
  points?: number;
}

export interface Address {
  region: string;
  city?: string;
}

export interface IUser {
  id: string;
  email: string;
  hashedPassword: string;
  role: string;
  accessToken?: string;
  username: string;
  age?: number;
  address?: Address;
  club?: string;
  rating: number;
  pair?: string;
}

export interface IBoxingRound {
  id: string;
  order: EBoxingRoundOrder;
  pair?: string;
  blackSide: ISide;
  whiteSide: ISide;
  winner?: string;
  judge?: string;
}

export interface IPair {
  id: string;
  number: number;
  blackParticipant?: string;
  whiteParticipant?: string;
  winner?: string;
  chessWin?: boolean;
  boxingRounds: string[];
  competition?: string;
}

export interface ICompetition {
  id: string;
  startDate: any;
  endDate: any;
  name: string;
}
