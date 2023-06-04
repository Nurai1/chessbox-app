import AC from 'accesscontrol';

import { ROLES, RESOURCES } from './constants.js';

const { AccessControl } = AC;

const ac = new AccessControl();

// TODO как включу проверку ролей - дописать нормально
ac.grant(ROLES.PARTICIPANT)
  // participant permissions for user entity
  .readAny(RESOURCES.USER)
  .readOwn(RESOURCES.USER)
  .updateOwn(RESOURCES.USER)
  // participant permissions for competition entity
  .readAny(RESOURCES.COMPETITION)
  // participant permissions for pair entity
  .readAny(RESOURCES.PAIR);

ac.grant(ROLES.JUDGE)
  .extend(ROLES.PARTICIPANT)
  // participant permissions for user entity
  .readAny(RESOURCES.USER);

ac.grant(ROLES.ADMIN)
  .extend(ROLES.PARTICIPANT)
  .extend(ROLES.JUDGE)
  // participant permissions for user entity
  .createAny(RESOURCES.USER)
  .updateAny(RESOURCES.USER)
  .deleteAny(RESOURCES.USER)
  // participant permissions for competition entity
  .createAny(RESOURCES.COMPETITION)
  .updateAny(RESOURCES.COMPETITION)
  .deleteAny(RESOURCES.COMPETITION);

export default ac;
