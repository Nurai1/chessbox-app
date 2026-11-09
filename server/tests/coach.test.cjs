const assert = require('node:assert/strict');
const { test, before, after, beforeEach, mock } = require('node:test');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { Types } = require('mongoose');

// No real database or email service is used by this suite.
process.env.MONGO_URI = 'mongodb://localhost/chessbox-coach-tests';
process.env.JWT_SECRET_KEY = 'coach-tests-only';
const sentEmails = [];
mock.method(nodemailer, 'createTransport', () => ({
  sendMail: async (message) => {
    sentEmails.push(message);
  },
}));

const { User, Competition } = require('../models');
const { userRouter } = require('../routes/userRoutes');
const { competitionRouter } = require('../routes/competitionRoutes');

const ids = {
  coach: '000000000000000000000001',
  otherCoach: '000000000000000000000002',
  chief: '000000000000000000000003',
  student: '000000000000000000000004',
  otherStudent: '000000000000000000000005',
  competition: '000000000000000000000006',
};
let users;
let competition;
let mutations;
let userFilters;

const profile = () => ({
  email: 'new-student@example.test',
  password: 'Student123!',
  firstName: 'New',
  lastName: 'Student',
  weight: 70,
  gender: 'man',
  birthDate: `${new Date().getFullYear() - 25}-01-01T00:00:00.000Z`,
  chessPlatform: { username: 'student-chess' },
  address: { country: 'Test country', city: 'Test city' },
  fightClub: { name: 'Test club' },
});

const snapshot = () => new Competition(competition.toObject());
const findUser = (filter) =>
  [...users.values()].find((user) =>
    Object.entries(filter).every(
      ([key, value]) => String(user[key]) === String(value)
    )
  );

mock.method(User.prototype, 'save', async function save() {
  await this.validate();
  if (findUser({ email: this.email }))
    throw Object.assign(new Error('Duplicate email'), { code: 11000 });
  users.set(String(this._id), this);
  return this;
});
mock.method(User, 'findById', async (id) => users.get(String(id)) ?? null);
mock.method(User, 'findOne', async (filter) => findUser(filter) ?? null);
mock.method(User, 'findOneAndUpdate', async (filter, update) => {
  const user = findUser(filter);
  if (!user) return null;
  user.set(update.$set ?? update);
  return user;
});
const matchesUser = (user, filter) => Object.entries(filter).every(([key, value]) => {
  if (key === '$and') return value.every((part) => matchesUser(user, part));
  if (key === '$or') return value.some((part) => matchesUser(user, part));
  return value instanceof RegExp ? value.test(user[key]) : String(user[key]) === String(value);
});
mock.method(User, 'find', (filter) => {
  userFilters.push(filter);
  let projection = '';
  let offset = 0;
  let limit = Infinity;
  const results = () => [...users.values()]
    .filter((user) => matchesUser(user, filter))
    .sort((a, b) => a.fullName.localeCompare(b.fullName))
    .slice(offset, offset + limit)
    .map((user) => {
      const result = user.toObject();
      const fields = projection.split(' ').filter(Boolean);
      if (fields.length && fields.every((field) => !field.startsWith('-'))) {
        return Object.fromEntries(Object.entries(result).filter(([key]) => fields.includes(key)));
      }
      fields.filter((key) => key.startsWith('-')).forEach((key) => { delete result[key.slice(1)]; });
      return result;
    });
  return {
    select(value) {
      projection = value;
      return this;
    },
    sort() { return this; },
    skip(value) { offset = value; return this; },
    limit(value) { limit = value; return this; },
    then(resolve, reject) { return Promise.resolve(results()).then(resolve, reject); },
  };
});
mock.method(User, 'countDocuments', async (filter) => [...users.values()].filter((user) => matchesUser(user, filter)).length);
mock.method(Competition, 'findOne', async (filter) =>
  String(filter._id) === ids.competition ? snapshot() : null
);
mock.method(Competition, 'findById', async (id) =>
  String(id) === ids.competition ? snapshot() : null
);

// Emulate the conditional single-document writes, including competing requests.
const updateCompetition = async (filter, update) => {
  if (String(filter._id) !== ids.competition) return null;
  if (
    filter.registrationEndsAt &&
    competition.registrationEndsAt <= filter.registrationEndsAt.$gt
  )
    return null;
  if (filter.started && competition.started) return null;
  if (filter.endDate === null && competition.endDate) return null;
  const selector = filter.usersPaymentInfo;
  const expected = selector?.$elemMatch;
  const payment =
    expected &&
    competition.usersPaymentInfo.find(
      (info) => String(info.userId) === expected.userId
    );
  if (
    expected &&
    (!payment ||
      Object.entries(expected).some(([key, value]) => {
        if (key === 'userId') return false;
        return value && typeof value === 'object'
          ? payment[key] === value.$ne
          : payment[key] !== value;
      }))
  )
    return null;
  if (
    selector?.$not &&
    competition.usersPaymentInfo.some(
      (info) => String(info.userId) === selector.$not.$elemMatch.userId
    )
  )
    return null;
  mutations.push({ filter, update });
  if (update.$push?.usersPaymentInfo)
    competition.usersPaymentInfo.push(update.$push.usersPaymentInfo);
  if (payment) {
    for (const [key, value] of Object.entries(update.$set ?? {}))
      payment[key.split('.').at(-1)] = value;
    for (const [key, value] of Object.entries(update.$inc ?? {}))
      payment[key.split('.').at(-1)] += value;
  }
  if (
    update.$addToSet?.participants &&
    !competition.participants.some(
      (id) => String(id) === update.$addToSet.participants
    )
  ) {
    competition.participants.push(
      new Types.ObjectId(update.$addToSet.participants)
    );
  }
  return snapshot();
};
mock.method(Competition, 'findOneAndUpdate', updateCompetition);
mock.method(Competition, 'findByIdAndUpdate', (id, update) =>
  updateCompetition({ _id: id }, update)
);

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      res.locals.loggedInUser = users.get(payload.userId);
    }
    next();
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});
app.use('/api', userRouter, competitionRouter);
app.use((error, req, res, next) =>
  res.status(500).send({ error: error.message })
);
let server;
let baseUrl;

before(async () => {
  server = await new Promise((resolve) => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api`;
});
after(async () => {
  await new Promise((resolve) => server.close(resolve));
  mock.restoreAll();
});
beforeEach(() => {
  users = new Map();
  mutations = [];
  userFilters = [];
  sentEmails.length = 0;
  for (const [name, role] of Object.entries({
    coach: 'coach',
    otherCoach: 'coach',
    chief: 'chief_judge',
    student: 'participant',
    otherStudent: 'participant',
  })) {
    users.set(
      ids[name],
      new User({
        ...profile(),
        _id: ids[name],
        email: `${name}@example.test`,
        firstName: 'Test',
        lastName: name,
        role,
        fullName: `Test ${name}`,
        hashedPassword: 'test-password-hash',
        emailConfirmed: true,
        coachId: name === 'student' ? ids.coach : undefined,
      })
    );
  }
  competition = new Competition({
    _id: ids.competition,
    name: 'Test competition',
    startDate: new Date(Date.now() + 172800000),
    registrationEndsAt: new Date(Date.now() + 86400000),
    participants: [],
    usersPaymentInfo: [],
    groups: [],
    judges: [],
  });
});

const request = async (
  path,
  { actor = 'coach', method = 'GET', body } = {}
) => {
  const headers = { 'Content-Type': 'application/json' };
  if (actor) {
    const user = users.get(ids[actor] ?? actor);
    headers['x-access-token'] = jwt.sign(
      { userId: String(user._id), hashedPassword: user.hashedPassword },
      process.env.JWT_SECRET_KEY
    );
  }
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
};
const paymentPath = (userId = ids.student) =>
  `/competition/${ids.competition}/setUserPaymentRequestToCheck/${userId}`;
const approvePath = `/competition/${ids.competition}/setUserPaymentPaid/${ids.student}`;
const seedPayment = (overrides = {}) => {
  competition.usersPaymentInfo.push({
    userId: ids.student,
    paid: false,
    requestedToCheck: true,
    requestedCount: 1,
    ...overrides,
  });
};

test('coach creates a participant with a hashed password, no confirmation email and no session token', async () => {
  const response = await request('/coach/participants', {
    method: 'POST',
    body: {
      ...profile(),
      role: 'chief_judge',
      coachId: ids.otherCoach,
      ratingNumber: 9000,
    },
  });
  assert.equal(response.status, 201);
  assert.equal(response.body.role, 'participant');
  assert.equal(response.body.coachId, ids.coach);
  assert.equal(response.body.emailConfirmed, true);
  assert.equal(response.body.ratingNumber, 1000);
  assert.equal(response.body.hashedPassword, undefined);
  assert.equal(response.body.oneTimeCode, undefined);
  assert.equal(response.body.accessToken, undefined);
  const createdUser = users.get(response.body._id);
  assert.ok(
    await bcrypt.compare(profile().password, createdUser.hashedPassword)
  );
  assert.equal(sentEmails.length, 0);
  const login = await request('/login', {
    actor: null,
    method: 'POST',
    body: { email: profile().email, password: profile().password },
  });
  assert.equal(login.status, 200);
  assert.equal(login.body.data.emailConfirmed, true);
});

test('creating pupils is available only to an authenticated coach', async () => {
  for (const [actor, status] of [
    [null, 401],
    ['student', 403],
    ['chief', 403],
  ]) {
    assert.equal(
      (
        await request('/coach/participants', {
          actor,
          method: 'POST',
          body: profile(),
        })
      ).status,
      status
    );
  }
  assert.equal(users.size, 5);
});

test('invalid and duplicate accounts do not create users or send emails', async () => {
  assert.equal(
    (
      await request('/coach/participants', {
        method: 'POST',
        body: { ...profile(), email: 'invalid' },
      })
    ).status,
    400
  );
  assert.equal(
    (
      await request('/coach/participants', {
        method: 'POST',
        body: { ...profile(), password: '123' },
      })
    ).status,
    400
  );
  assert.equal(
    (
      await request('/coach/participants', {
        method: 'POST',
        body: { ...profile(), birthDate: 'not-a-date' },
      })
    ).status,
    400
  );
  assert.equal(
    (
      await request('/coach/participants', {
        method: 'POST',
        body: { ...profile(), email: 'student@example.test' },
      })
    ).status,
    409
  );
  assert.equal(users.size, 5);
  assert.equal(sentEmails.length, 0);
});

test('coach can search all participants but receives no private fields', async () => {
  const response = await request('/coach/participants?search=Test%20otherStudent');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.items.map((user) => user._id), [ids.otherStudent]);
  assert.equal(response.body.total, 1);
  assert.equal(response.body.items[0].email, undefined);
  assert.equal(response.body.items[0].hashedPassword, undefined);
  assert.equal(response.body.items[0].oneTimeCode, undefined);
  assert.equal(userFilters[0].role, 'participant');
  assert.equal((await request('/coach/participants', { actor: 'otherCoach' })).body.total, 2);
});

test('coach search returns only participants with a confirmed email', async () => {
  users.get(ids.otherStudent).set({ emailConfirmed: false });
  users.get(ids.student).set({ emailConfirmed: undefined });
  const response = await request('/coach/participants?search=Test');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.items, []);
  assert.equal(response.body.total, 0);
  assert.equal(userFilters[0].emailConfirmed, true);
});

test('public signup cannot set coach role or claim ownership', async () => {
  const response = await request('/signup', {
    actor: null,
    method: 'POST',
    body: {
      ...profile(),
      role: 'coach',
      coachId: ids.coach,
      emailConfirmed: true,
    },
  });
  assert.equal(response.status, 200);
  const user = findUser({ email: profile().email });
  assert.equal(user.role, 'participant');
  assert.equal(user.emailConfirmed, false);
  assert.equal(user.coachId, undefined);
  assert.equal(sentEmails.length, 1);
});

test('profile edits cannot grant a role, change ownership or rating', async () => {
  const response = await request('/user/currentUser', {
    method: 'PATCH',
    body: {
      firstName: 'Updated',
      role: 'chief_judge',
      coachId: ids.otherCoach,
      ratingNumber: 9000,
    },
  });
  assert.equal(response.status, 200);
  assert.equal(response.body.firstName, 'Updated');
  assert.equal(response.body.role, 'coach');
  assert.equal(response.body.coachId, undefined);
  assert.notEqual(response.body.ratingNumber, 9000);
});

test('coach registration creates only a pending payment request', async () => {
  const response = await request(paymentPath(), {
    method: 'PATCH',
    body: { message: 'Payment for my student' },
  });
  assert.equal(response.status, 200);
  assert.equal(response.body.usersPaymentInfo.length, 1);
  assert.equal(response.body.usersPaymentInfo[0].paid, false);
  assert.equal(response.body.usersPaymentInfo[0].requestedToCheck, true);
  assert.equal(
    response.body.usersPaymentInfo[0].message,
    'Payment for my student'
  );
  assert.equal(response.body.participants.length, 0);
});

test('any coach can register any participant but cannot register self', async () => {
  assert.equal(
    (
      await request(paymentPath(), {
        actor: 'otherCoach',
        method: 'PATCH',
        body: {},
      })
    ).status,
    200
  );
  assert.equal(
    (
      await request(paymentPath(ids.otherStudent), {
        method: 'PATCH',
        body: {},
      })
    ).status,
    200
  );
  assert.equal(
    (await request(paymentPath(ids.coach), { method: 'PATCH', body: {} }))
      .status,
    403
  );
  assert.equal(mutations.length, 2);
});

test('ordinary participant can still request their own registration', async () => {
  assert.equal(
    (
      await request(paymentPath(), {
        actor: 'student',
        method: 'PATCH',
        body: {},
      })
    ).status,
    200
  );
  assert.equal(
    (
      await request(paymentPath(ids.otherStudent), {
        actor: 'student',
        method: 'PATCH',
        body: {},
      })
    ).status,
    403
  );
  assert.equal(
    (await request(paymentPath(), { actor: null, method: 'PATCH', body: {} }))
      .status,
    401
  );
});

test('pending requests are idempotent, including simultaneous submissions', async () => {
  const results = await Promise.all(
    [1, 2].map(() => request(paymentPath(), { method: 'PATCH', body: {} }))
  );
  results.forEach((result) => assert.equal(result.status, 200));
  assert.equal(competition.usersPaymentInfo.length, 1);
  assert.equal(competition.usersPaymentInfo[0].requestedCount, 1);
  assert.equal(mutations.length, 1);
});

for (const actor of ['student', 'coach']) {
  for (const requestedCount of [3, 4]) {
    test(`${actor} cannot send another payment request after ${requestedCount} attempts`, async () => {
      seedPayment({
        requestedCount,
        requestedToCheck: false,
        message: 'Previous request',
      });
      const response = await request(paymentPath(), {
        actor,
        method: 'PATCH',
        body: { message: 'One more request' },
      });
      assert.equal(response.status, 400);
      assert.equal(
        competition.usersPaymentInfo[0].requestedCount,
        requestedCount
      );
      assert.equal(competition.usersPaymentInfo[0].requestedToCheck, false);
      assert.equal(competition.usersPaymentInfo[0].message, 'Previous request');
      assert.equal(mutations.length, 0);
      assert.equal(sentEmails.length, 0);
    });
  }

  test(`${actor} replay of the third pending payment request does not send a fourth request`, async () => {
    seedPayment({ requestedCount: 3, message: 'Third request' });
    const response = await request(paymentPath(), {
      actor,
      method: 'PATCH',
      body: { message: 'One more request' },
    });
    assert.equal(response.status, 200);
    assert.equal(competition.usersPaymentInfo[0].requestedCount, 3);
    assert.equal(competition.usersPaymentInfo[0].message, 'Third request');
    assert.equal(mutations.length, 0);
    assert.equal(sentEmails.length, 0);
  });

  test(`${actor} simultaneous submissions at two attempts create only the third payment request`, async () => {
    seedPayment({ requestedCount: 2, requestedToCheck: false });
    const responses = await Promise.all(
      [1, 2].map(() =>
        request(paymentPath(), {
          actor,
          method: 'PATCH',
          body: {},
        })
      )
    );
    responses.forEach((response) => assert.equal(response.status, 200));
    assert.equal(competition.usersPaymentInfo[0].requestedCount, 3);
    assert.equal(competition.usersPaymentInfo.length, 1);
    assert.equal(mutations.length, 1);
    assert.equal(sentEmails.length, 1);
  });
}

test('registration cannot reset an approved payment', async () => {
  seedPayment({ paid: true, requestedToCheck: false });
  assert.equal(
    (await request(paymentPath(), { method: 'PATCH', body: {} })).status,
    200
  );
  assert.equal(competition.usersPaymentInfo[0].paid, true);
  assert.equal(mutations.length, 0);
});

test('closed, started, completed and unsuitable competitions reject registration', async () => {
  competition.registrationEndsAt = new Date(Date.now() - 1000);
  assert.equal(
    (await request(paymentPath(), { method: 'PATCH', body: {} })).status,
    400
  );
  competition.registrationEndsAt = new Date(Date.now() + 86400000);
  competition.started = true;
  assert.equal(
    (await request(paymentPath(), { method: 'PATCH', body: {} })).status,
    400
  );
  competition.started = false;
  competition.endDate = new Date();
  assert.equal(
    (await request(paymentPath(), { method: 'PATCH', body: {} })).status,
    400
  );
  competition.endDate = undefined;
  competition.requirements = { weightCategory: { from: 80, to: 100 } };
  assert.equal(
    (await request(paymentPath(), { method: 'PATCH', body: {} })).status,
    400
  );
  assert.equal(mutations.length, 0);
});

test('only chief judge can approve payment or directly admit participants', async () => {
  seedPayment();
  for (const actor of ['coach', 'student', 'otherCoach', null]) {
    const expected = actor ? 403 : 401;
    assert.equal(
      (
        await request(approvePath, {
          actor,
          method: 'PATCH',
          body: { paid: true },
        })
      ).status,
      expected
    );
    assert.equal(
      (
        await request(`/competition/${ids.competition}/addNewParticipant`, {
          actor,
          method: 'PATCH',
          body: { userId: ids.student },
        })
      ).status,
      expected
    );
  }
  assert.equal(mutations.length, 0);
});

test('chief approval atomically admits the student and repeated approval does not duplicate them', async () => {
  seedPayment();
  const response = await request(approvePath, {
    actor: 'chief',
    method: 'PATCH',
    body: { paid: true },
  });
  assert.equal(response.status, 200);
  assert.equal(response.body.usersPaymentInfo[0].paid, true);
  assert.deepEqual(response.body.participants, [ids.student]);
  assert.equal(mutations.length, 1);
  assert.equal(mutations[0].update.$set['usersPaymentInfo.$.paid'], true);
  assert.equal(mutations[0].update.$addToSet.participants, ids.student);
  assert.equal(
    (
      await request(approvePath, {
        actor: 'chief',
        method: 'PATCH',
        body: { paid: true },
      })
    ).status,
    200
  );
  assert.equal(competition.participants.length, 1);
});

test('rejection allows resubmission, third pending attempt can be approved, fourth is blocked', async () => {
  seedPayment({ requestedCount: 2 });
  assert.equal(
    (
      await request(approvePath, {
        actor: 'chief',
        method: 'PATCH',
        body: { paid: false },
      })
    ).status,
    200
  );
  assert.equal(competition.participants.length, 0);
  assert.equal(
    (await request(paymentPath(), { method: 'PATCH', body: {} })).status,
    200
  );
  assert.equal(competition.usersPaymentInfo[0].requestedCount, 3);
  assert.equal(
    (
      await request(approvePath, {
        actor: 'chief',
        method: 'PATCH',
        body: { paid: false },
      })
    ).status,
    200
  );
  assert.equal(
    (await request(paymentPath(), { method: 'PATCH', body: {} })).status,
    400
  );
  competition.usersPaymentInfo[0].requestedToCheck = true;
  assert.equal(
    (
      await request(approvePath, {
        actor: 'chief',
        method: 'PATCH',
        body: { paid: true },
      })
    ).status,
    200
  );
});

test('invalid payment payload and bypass through technical endpoints are rejected', async () => {
  seedPayment();
  assert.equal(
    (
      await request(approvePath, {
        actor: 'chief',
        method: 'PATCH',
        body: { paid: 'true' },
      })
    ).status,
    400
  );
  assert.equal(
    (
      await request(`/competition/${ids.competition}/addNewParticipant`, {
        actor: 'chief',
        method: 'PATCH',
        body: { userId: ids.student },
      })
    ).status,
    409
  );
  assert.equal(
    (
      await request('/user', {
        method: 'PATCH',
        body: { _id: ids.coach, role: 'chief_judge' },
      })
    ).status,
    403
  );
  assert.equal(
    (
      await request(`/competition/${ids.competition}`, {
        method: 'PATCH',
        body: { participants: [ids.student] },
      })
    ).status,
    403
  );
  assert.equal(mutations.length, 0);
});
