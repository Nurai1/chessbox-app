const assert = require('node:assert/strict');
const { after, before, beforeEach, mock, test } = require('node:test');
const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

process.env.MONGO_URI = 'mongodb://localhost/chessbox-email-tests';
process.env.JWT_SECRET_KEY = 'email-tests-only';
process.env.CLIENT_URL = 'https://chessbox.example.test';

const emails = [];
mock.method(nodemailer, 'createTransport', () => ({
  sendMail: async (message) => {
    emails.push(message);
  },
}));

const { User } = require('../models');
const { userRouter } = require('../routes/userRoutes');
const users = new Map();
let saves = 0;

mock.method(User.prototype, 'save', async function save() {
  await this.validate();
  users.set(String(this._id), this);
  saves++;
  return this;
});
mock.method(
  User,
  'findOne',
  async (filter) =>
    [...users.values()].find((user) => user.email === filter.email) ?? null
);
mock.method(User, 'findById', async (id) => users.get(String(id)) ?? null);

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  const token = req.headers['x-access-token'];
  if (token) {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    res.locals.loggedInUser = users.get(payload.userId);
  }
  next();
});
app.use('/api', userRouter);
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
  users.clear();
  emails.length = 0;
  saves = 0;
});

const profile = {
  email: 'athlete@example.test',
  password: 'Athlete123!',
  firstName: 'Test',
  lastName: 'Athlete',
  weight: 70,
  gender: 'man',
  birthDate: '2000-01-01T00:00:00.000Z',
  chessPlatform: { username: 'athlete-chess' },
  address: { country: 'Country', city: 'City' },
  fightClub: { name: 'Club' },
};
const request = async (path, { method = 'POST', body, token } = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-access-token': token } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
};
const register = async (email = profile.email) => {
  const response = await request('/signup', { body: { ...profile, email } });
  assert.equal(response.status, 200);
  const message = emails.at(-1);
  const link = new URL(message.text.trim().split('\n').at(-1));
  return {
    response,
    user: [...users.values()].find((user) => user.email === email),
    confirmation: {
      email: link.searchParams.get('email'),
      confirmationCode: link.searchParams.get('confirmationCode'),
    },
  };
};
const confirm = (body, token) =>
  request('/user/confirmEmail', { method: 'PATCH', body, token });
const login = () =>
  request('/login', {
    body: { email: profile.email, password: profile.password },
  });

test('signup response exposes neither confirmation code nor credentials nor a login session', async () => {
  const { response, user } = await register();
  assert.deepEqual(response.body, {
    email: profile.email,
    emailConfirmed: false,
  });
  assert.equal(user.emailConfirmed, false);
  assert.ok(user.oneTimeCode);
  assert.equal(emails.length, 1);
});

test('unconfirmed account cannot sign in', async () => {
  await register();
  const response = await login();
  assert.equal(response.status, 403);
  assert.equal(response.body.accessToken, undefined);
});

test('registration on desktop, confirmation without a session on phone, then desktop login succeeds', async () => {
  const { confirmation, user } = await register();
  const mobileResponse = await confirm(confirmation);
  assert.equal(mobileResponse.status, 200);
  assert.deepEqual(mobileResponse.body, { emailConfirmed: true });
  assert.equal(user.oneTimeCode, null);
  const desktopResponse = await login();
  assert.equal(desktopResponse.status, 200);
  assert.ok(desktopResponse.body.accessToken);
  const currentUser = await request('/user/getCurrentUser', {
    method: 'GET',
    token: desktopResponse.body.accessToken,
  });
  assert.equal(currentUser.status, 200);
  assert.equal(currentUser.body.emailConfirmed, true);
});

test('opening the same confirmation link again succeeds without issuing a session', async () => {
  const { confirmation } = await register();
  assert.equal((await confirm(confirmation)).status, 200);
  const saveCount = saves;
  const replay = await confirm(confirmation);
  assert.equal(replay.status, 200);
  assert.deepEqual(replay.body, { emailConfirmed: true });
  assert.equal(saves, saveCount);
});

test('simultaneous confirmations both succeed, including duplicated browser effects', async () => {
  const { confirmation, user } = await register();
  const responses = await Promise.all([
    confirm(confirmation),
    confirm(confirmation),
  ]);
  responses.forEach((response) => {
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { emailConfirmed: true });
  });
  assert.equal(user.emailConfirmed, true);
});

test('confirmation does not replace a session belonging to another account', async () => {
  const { confirmation } = await register();
  const other = await register('other@example.test');
  other.user.emailConfirmed = true;
  const token = jwt.sign(
    {
      userId: String(other.user._id),
      hashedPassword: other.user.hashedPassword,
    },
    process.env.JWT_SECRET_KEY
  );
  assert.deepEqual((await confirm(confirmation, token)).body, {
    emailConfirmed: true,
  });
  const currentUser = await request('/user/getCurrentUser', {
    method: 'GET',
    token,
  });
  assert.equal(currentUser.body.email, 'other@example.test');
});

test('incorrect confirmation code does not verify an account', async () => {
  const { confirmation, user } = await register();
  const originalCode = user.oneTimeCode;
  const wrongCode = originalCode === 1234 ? '4321' : '1234';
  assert.equal(
    (await confirm({ ...confirmation, confirmationCode: wrongCode })).status,
    400
  );
  assert.equal(user.emailConfirmed, false);
  assert.equal(user.oneTimeCode, originalCode);
});

test('malformed confirmation requests are rejected without changing the account', async () => {
  const { confirmation, user } = await register();
  for (const body of [
    {},
    { ...confirmation, confirmationCode: null },
    { ...confirmation, confirmationCode: '' },
    { ...confirmation, email: 'invalid' },
  ]) {
    assert.equal((await confirm(body)).status, 400);
  }
  assert.equal(user.emailConfirmed, false);
});

test('unknown email cannot be confirmed', async () => {
  assert.equal(
    (await confirm({ email: 'missing@example.test', confirmationCode: '1234' }))
      .status,
    400
  );
});

test('reopening a consumed link does not erase a later password reset code', async () => {
  const { confirmation, user } = await register();
  await confirm(confirmation);
  user.oneTimeCode = 9876;
  assert.equal((await confirm(confirmation)).status, 200);
  assert.equal(user.oneTimeCode, 9876);
});

test('confirmed account still needs the correct password to sign in', async () => {
  const { confirmation } = await register();
  await confirm(confirmation);
  const response = await request('/login', {
    body: { email: profile.email, password: 'wrong-password' },
  });
  assert.equal(response.status, 400);
  assert.equal(response.body.accessToken, undefined);
});

test('legacy accounts without an emailConfirmed field retain their login behavior', async () => {
  const { user } = await register();
  user.emailConfirmed = undefined;
  assert.equal((await login()).status, 200);
});
