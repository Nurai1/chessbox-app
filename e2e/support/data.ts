import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { Db, ObjectId } from 'mongodb';

export const password = 'ChessboxTest42!';
type Role = 'participant' | 'coach' | 'chief_judge';

export type Account = {
  _id: ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: Role;
  coachId?: ObjectId;
  emailConfirmed: boolean;
  oneTimeCode: number | null;
  weight: number;
  gender: string;
  hashedPassword: string;
};

export type Payment = {
  userId: ObjectId;
  paid: boolean;
  requestedToCheck: boolean;
  requestedCount: number;
  message: string;
};

export type Competition = {
  _id: ObjectId;
  name: string;
  registrationEndsAt: Date;
  startDate: Date;
  endDate: Date | null;
  started: boolean;
  participants: ObjectId[];
  usersPaymentInfo: Payment[];
  requirements: {
    ageCategory: { from: number; to: number };
    weightCategory: { from: number; to: number };
    gender: string;
  };
};

export class TestData {
  readonly namespace = `e2e-${randomUUID()}`;
  readonly emails = new Set<string>();
  private readonly competitionIds: ObjectId[] = [];
  readonly users;
  readonly competitions;
  coach!: Account;
  chief!: Account;
  student!: Account;
  otherCoach!: Account;
  otherStudent!: Account;
  participant!: Account;
  competition!: Competition;

  constructor(db: Db) {
    this.users = db.collection<Account>('users');
    this.competitions = db.collection<Competition>('competitions');
  }

  // Reserve before UI signup too, so a failed assertion never skips cleanup.
  email(label: string) {
    const email = `${this.namespace}+${label}@e2e.test`;
    this.emails.add(email);
    return email;
  }

  private async account(label: string, role: Role, hash: string, coachId?: ObjectId) {
    const account = {
      _id: new ObjectId(),
      email: this.email(label),
      firstName: 'Test',
      lastName: label,
      fullName: `Test ${label}`,
      role,
      ...(coachId ? { coachId } : {}),
      hashedPassword: hash,
      emailConfirmed: true,
      oneTimeCode: null,
      weight: 75,
      birthDate: new Date('2000-01-15T00:00:00.000Z'),
      gender: 'man',
      address: { country: 'Thailand', city: 'Bangkok' },
      fightClub: { name: 'E2E Club' },
      chessPlatform: { username: 'e2eplayer' },
      ratingNumber: 1000,
      competitionsHistory: [],
    };
    await this.users.insertOne(account);
    return account;
  }

  async seed() {
    const hash = await bcrypt.hash(password, 10);
    this.coach = await this.account('Coach', 'coach', hash);
    this.chief = await this.account('Chief', 'chief_judge', hash);
    this.student = await this.account('Student', 'participant', hash, this.coach._id);
    this.otherCoach = await this.account('OtherCoach', 'coach', hash);
    this.otherStudent = await this.account('OtherStudent', 'participant', hash, this.otherCoach._id);
    this.participant = await this.account('Independent', 'participant', hash);
    this.competition = await this.createCompetition();
  }

  async createCompetition(overrides: Partial<Competition> = {}) {
    const competition = {
      _id: new ObjectId(),
      name: `${this.namespace} tournament ${this.competitionIds.length + 1}`,
      description: 'Playwright test tournament',
      startDate: new Date(Date.now() + 14 * 86400_000),
      baseDate: new Date(Date.now() + 14 * 86400_000),
      registrationEndsAt: new Date(Date.now() + 7 * 86400_000),
      endDate: null,
      started: false,
      chiefJudgeEndedConfiguration: false,
      groups: [],
      judges: [],
      participants: [],
      usersPaymentInfo: [],
      price: { currentValue: 100, valueForMembers: 100, currency: 'USD', pricesChanges: [] },
      requirements: {
        ageCategory: { from: 18, to: 99 },
        weightCategory: { from: 50, to: 100 },
        gender: 'man',
      },
      ...overrides,
    };
    this.competitionIds.push(competition._id);
    await this.competitions.insertOne(competition);
    return competition;
  }

  async user(email: string) {
    const user = await this.users.findOne({ email });
    if (!user) throw new Error(`Expected E2E user ${email}`);
    return user;
  }

  async payment(email: string, competition = this.competition) {
    const user = await this.user(email);
    const current = await this.competitions.findOne({ _id: competition._id });
    if (!current) throw new Error('E2E competition missing');
    const rows = current.usersPaymentInfo.filter(row => row.userId.equals(user._id));
    return {
      rows: rows.length,
      paid: rows[0]?.paid ?? false,
      pending: rows[0]?.requestedToCheck ?? false,
      count: rows[0]?.requestedCount ?? 0,
      message: rows[0]?.message ?? '',
      admissions: current.participants.filter(id => id.equals(user._id)).length,
    };
  }

  async cleanup() {
    // Exact IDs and reserved addresses only. No dropDatabase or broad delete.
    await this.competitions.deleteMany({ _id: { $in: this.competitionIds } });
    await this.users.deleteMany({ email: { $in: [...this.emails] } });
  }
}
