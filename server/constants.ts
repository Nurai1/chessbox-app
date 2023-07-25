export const ROLES = {
  PARTICIPANT: 'participant',
  JUDGE: 'judge',
  MAIN_JUDGE: 'main_judge',
} as const;

export const RESOURCES = {
  USER: 'USER',
  COMPETITION: 'COMPETITION',
} as const;

export const ACTIONS = {
  readOwn: 'readOwn',
  updateOwn: 'updateOwn',
  readAny: 'readAny',
  updateAny: 'updateAny',
  deleteAny: 'deleteAny',
  createAny: 'createAny',
} as const;
