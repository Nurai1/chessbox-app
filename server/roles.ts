import AC from 'accesscontrol';

import { ROLES, RESOURCES } from './constants.js';

const { AccessControl } = AC;

const ac = new AccessControl();

ac.grant(ROLES.PARTICIPANT).readOwn(RESOURCES.USER).updateOwn(RESOURCES.USER);

ac.grant(ROLES.JUDGE).extend(ROLES.PARTICIPANT).readAny(RESOURCES.USER);

ac.grant(ROLES.ADMIN)
  .extend(ROLES.PARTICIPANT)
  .extend(ROLES.JUDGE)
  .createAny(RESOURCES.USER)
  .updateAny(RESOURCES.USER)
  .deleteAny(RESOURCES.USER);

export default ac;
