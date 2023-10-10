import AC from 'accesscontrol';

import { ROLES, RESOURCES } from './constants';

const { AccessControl } = AC;

const ac = new AccessControl();

ac.grant(ROLES.PARTICIPANT)
  // participant permissions for user entity
  .readAny(RESOURCES.USER)
  .updateOwn(RESOURCES.USER)
  // participant permissions for competition entity
  .readAny(RESOURCES.COMPETITION)
  .readOwn(RESOURCES.COMPETITION)
  .updateOwn(RESOURCES.PAIR);

ac.grant(ROLES.CHIEF_JUDGE)
  .readAny(RESOURCES.USER)
  .readOwn(RESOURCES.USER)
  .readAny(RESOURCES.COMPETITION)
  .updateAny(RESOURCES.COMPETITION);

export default ac;
