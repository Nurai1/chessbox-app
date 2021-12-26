export const ROLES = {
  PARTICIPANT: 'PARTICIPANT',
  JUDGE: 'JUDGE',
  ADMIN: 'ADMIN',
} as const;

export const RESOURCES = {
  USER: 'USER',
} as const;

export const ACTIONS = {
  readOwn: 'readOwn',
  updateOwn: 'updateOwn',
  readAny: 'readAny',
  updateAny: 'updateAny',
  deleteAny: 'deleteAny',
} as const;
