import { AccessControl } from 'accesscontrol';
// import { ROLES, RESOURCES } from './constants';

export const ROLES = {
  PARTICIPANT: 'PARTICIPANT',
  JUDGE: 'JUDGE',
  ADMIN: 'ADMIN',
} as const;
export const RESOURCES = {
  USER: 'USER',
} as const;

const ac = new AccessControl();

ac.grant(ROLES.PARTICIPANT).readOwn(RESOURCES.USER).updateOwn(RESOURCES.USER);

ac.grant(ROLES.JUDGE).extend(ROLES.PARTICIPANT).readAny(RESOURCES.USER);

ac.grant(ROLES.ADMIN)
  .extend(ROLES.PARTICIPANT)
  .extend(ROLES.JUDGE)
  .updateAny(RESOURCES.USER)
  .deleteAny(RESOURCES.USER);

export default ac;
