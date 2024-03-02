export const ROLES = {
  PARTICIPANT: 'participant',
  JUDGE: 'judge',
  CHIEF_JUDGE: 'chief_judge',
} as const;

export const RESOURCES = {
  USER: 'USER',
  COMPETITION: 'COMPETITION',
  PAIR: 'PAIR',
} as const;

export const ACTIONS = {
  readOwn: 'readOwn',
  updateOwn: 'updateOwn',
  readAny: 'readAny',
  updateAny: 'updateAny',
  deleteAny: 'deleteAny',
  createAny: 'createAny',
} as const;

// TODO: remove it
export const SMTP_USER_MAIL = 'carryitthroughlife@gmail.com';

export const NODEMAILER_TRANSPORT_CONFIG = {
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER_MAIL || SMTP_USER_MAIL,
    pass: process.env.SMTP_SERVICE_PASSKEY,
  },
};
