export const ROLES = {
  PARTICIPANT: 'participant',
  COACH: 'coach',
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

export const SMTP_USER_MAIL = 'carryitthroughlife@gmail.com';
export const SMTP_USER_OFFICIAL_MAIL = 'no-reply@chessboxingfit.com';

// An explicit SMTP host also allows E2E runs to deliver real mail to Mailpit.
export const NODEMAILER_TRANSPORT_CONFIG = process.env.SMTP_HOST
  ? {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 1025),
      secure: process.env.SMTP_SECURE === 'true',
      ...(process.env.SMTP_SERVICE_PASSKEY
        ? {
            auth: {
              user: process.env.SMTP_USER_MAIL || SMTP_USER_MAIL,
              pass: process.env.SMTP_SERVICE_PASSKEY,
            },
          }
        : {}),
    }
  : {
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER_MAIL || SMTP_USER_MAIL,
        pass: process.env.SMTP_SERVICE_PASSKEY,
      },
    };

const remoteMongoUri = process.env.MONGO_URI;
export const MONGO_ENV = remoteMongoUri?.slice(
  remoteMongoUri.lastIndexOf('mongodb.net/') + 'mongodb.net/'.length,
  remoteMongoUri.lastIndexOf('?retryWrites=true&w=majority')
);
