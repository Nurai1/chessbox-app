export const ROLES = {
  PARTICIPANT: 'participant',
  JUDGE: 'judge',
  ADMIN: 'admin',
} as const;

export const RESOURCES = {
  USER: 'USER',
  COMPETITION: 'COMPETITION',
  PAIR: 'PAIR',
  BOXING_ROUND: 'BOXING_ROUND',
} as const;

export const ACTIONS = {
  readOwn: 'readOwn',
  updateOwn: 'updateOwn',
  readAny: 'readAny',
  updateAny: 'updateAny',
  deleteAny: 'deleteAny',
  createAny: 'createAny',
} as const;
