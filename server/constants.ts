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
