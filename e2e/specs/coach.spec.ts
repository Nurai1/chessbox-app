import { test, expect } from '../support/fixtures';
import { assertProfile, fillAccount, login, openStudents, refreshStudents, requestPayment, reviewPayment, studentCard, token } from '../support/ui';

test('coach creates an immediately usable student account; only chief approval admits it', async ({ actor, data, mailbox }) => {
  const coach = await actor();
  const chief = await actor();
  const student = await actor();
  const email = data.email('created-by-coach');
  await login(coach, data.coach.email);
  const coachToken = await token(coach);
  await openStudents(coach, data.competition);
  await coach.getByRole('button', { name: 'Create student account', exact: true }).click();
  await fillAccount(coach, email);
  const creation = coach.waitForResponse(r => r.url().endsWith('/api/coach/participants') && r.request().method() === 'POST');
  await coach.locator('form').getByRole('button', { name: 'Create student account', exact: true }).click();
  expect((await creation).status()).toBe(201);
  const card = studentCard(coach, email);
  await expect(card).toBeVisible();
  const created = await data.user(email);
  expect(created.emailConfirmed).toBe(true);
  expect(created.role).toBe('participant');
  expect(created.coachId?.equals(data.coach._id)).toBe(true);
  expect(created.oneTimeCode).toBeNull();
  expect(await token(coach)).toBe(coachToken);
  expect(await mailbox.messages(email)).toHaveLength(0);

  await login(student, email);
  await assertProfile(student, email);
  await requestPayment(coach, card, 'Receipt for the new student');
  await expect.poll(() => data.payment(email)).toMatchObject({
    rows: 1, count: 1, pending: true, paid: false, admissions: 0, message: 'Receipt for the new student',
  });
  await coach.reload();
  await expect(studentCard(coach, email)).toContainText('Waiting for the chief judge');
  await expect(studentCard(coach, email).getByRole('button', { name: 'Request payment verification' })).toHaveCount(0);

  await login(chief, data.chief.email);
  await reviewPayment(chief, data.competition, email, true);
  await refreshStudents(coach);
  await expect(studentCard(coach, email)).toContainText('The student is admitted to the competition.');
  await expect.poll(() => data.payment(email)).toMatchObject({ rows: 1, count: 1, paid: true, pending: false, admissions: 1 });
  await chief.reload();
  await expect(chief.getByText(email, { exact: true })).toBeVisible();
  await expect(chief.getByRole('button', { name: 'Paid', exact: true })).toHaveCount(0);
  await coach.reload();
  await expect(studentCard(coach, email)).toContainText('The student is admitted to the competition.');
  await assertProfile(coach, data.coach.email);
});

for (const acceptThird of [false, true]) {
  test(`three payment requests: chief ${acceptThird ? 'accepts' : 'rejects'} the third`, async ({ actor, data }) => {
    const coach = await actor();
    const chief = await actor();
    await login(coach, data.coach.email);
    await login(chief, data.chief.email);
    await openStudents(coach, data.competition);
    const card = studentCard(coach, data.student.email);
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      await requestPayment(coach, card, `Payment attempt ${attempt}`);
      await expect.poll(() => data.payment(data.student.email)).toMatchObject({
        rows: 1, count: attempt, pending: true, paid: false, admissions: 0,
      });
      // The third pending request must still be reviewable by the chief.
      await reviewPayment(chief, data.competition, data.student.email, attempt === 3 && acceptThird);
      await refreshStudents(coach);
      if (attempt < 3) {
        await expect(card).toContainText('Payment was not confirmed.');
        await expect(card.getByRole('button', { name: 'Request payment verification', exact: true })).toBeEnabled();
      }
    }
    await expect(card).toContainText(acceptThird ? 'The student is admitted' : 'request limit has been reached');
    await expect(card.getByRole('button', { name: 'Request payment verification', exact: true })).toHaveCount(0);
    await coach.reload();
    await expect(card).toContainText(acceptThird ? 'The student is admitted' : 'request limit has been reached');
    await expect.poll(() => data.payment(data.student.email)).toMatchObject({
      rows: 1, count: 3, paid: acceptThird, pending: false, admissions: acceptThird ? 1 : 0,
    });
    if (!acceptThird) {
      // The student cannot bypass the shared limit by switching to self-service.
      const student = await actor();
      await login(student, data.student.email);
      await student.goto(`/#/competitions/${data.competition._id}`);
      await student.getByRole('button', { name: 'Participate', exact: true }).click();
      await expect(student.getByRole('button', { name: 'Transferred!', exact: true })).toBeDisabled();
      await expect(student.getByText('The payment verification request limit has been reached. Contact the organizer.', { exact: true })).toBeVisible();
      expect((await data.payment(data.student.email)).count).toBe(3);
    }
  });
}

test('coach sees only their students and cannot open chief approval; participant cannot open coach tools', async ({ actor, data }) => {
  const coach = await actor();
  await login(coach, data.coach.email);
  await openStudents(coach, data.competition);
  await expect(studentCard(coach, data.student.email)).toBeVisible();
  await expect(studentCard(coach, data.otherStudent.email)).toHaveCount(0);
  await expect(studentCard(coach, data.participant.email)).toHaveCount(0);
  await coach.goto(`/#/competitions/${data.competition._id}/verify-payment`);
  await expect(coach).toHaveURL(/#\/competitions$/);
  await expect(coach.getByRole('button', { name: 'Paid', exact: true })).toHaveCount(0);

  const other = await actor();
  await login(other, data.otherCoach.email);
  await openStudents(other, data.competition);
  await expect(studentCard(other, data.otherStudent.email)).toBeVisible();
  await expect(studentCard(other, data.student.email)).toHaveCount(0);

  const participant = await actor();
  await login(participant, data.participant.email);
  await participant.goto('/#/coach/participants');
  await expect(participant).toHaveURL(/#\/competitions$/);
  await expect(participant.getByRole('button', { name: 'Create student account', exact: true })).toHaveCount(0);
});

test('duplicate student email shows an error and preserves both the account and coach session', async ({ actor, data }) => {
  const coach = await actor();
  await login(coach, data.coach.email);
  const originalToken = await token(coach);
  await openStudents(coach, data.competition);
  await coach.getByRole('button', { name: 'Create student account', exact: true }).click();
  await fillAccount(coach, data.otherStudent.email);
  const response = coach.waitForResponse(r => r.url().endsWith('/api/coach/participants') && r.request().method() === 'POST');
  await coach.locator('form').getByRole('button', { name: 'Create student account', exact: true }).click();
  expect((await response).status()).toBe(409);
  await expect(coach.getByText('An account with this email already exists.', { exact: true })).toBeVisible();
  expect(await data.users.countDocuments({ email: data.otherStudent.email })).toBe(1);
  expect((await data.user(data.otherStudent.email)).coachId?.equals(data.otherCoach._id)).toBe(true);
  expect(await token(coach)).toBe(originalToken);
});

for (const state of ['closed', 'started', 'ended', 'requirements'] as const) {
  test(`coach cannot register a student when competition is ${state}`, async ({ actor, data }) => {
    const competition = await data.createCompetition({
      ...(state === 'closed' ? { registrationEndsAt: new Date(Date.now() - 86400_000) } : {}),
      ...(state === 'started' ? { started: true } : {}),
      ...(state === 'ended' ? { endDate: new Date() } : {}),
      ...(state === 'requirements' ? { requirements: { ...data.competition.requirements, gender: 'woman' } } : {}),
    });
    const coach = await actor();
    await login(coach, data.coach.email);
    await openStudents(coach, competition);
    const card = studentCard(coach, data.student.email);
    await expect(card).toContainText(state === 'requirements' ? 'does not meet the age, weight or gender requirements' : /Registration closed/i);
    await expect(card.getByRole('button', { name: 'Request payment verification', exact: true })).toHaveCount(0);
    expect(await data.payment(data.student.email, competition)).toMatchObject({ rows: 0, admissions: 0 });
  });
}

test('ordinary participant uses the same payment queue and is admitted by the chief', async ({ actor, data }) => {
  const participant = await actor();
  const chief = await actor();
  await login(participant, data.participant.email);
  await participant.goto(`/#/competitions/${data.competition._id}`);
  await participant.getByRole('button', { name: 'Participate', exact: true }).click();
  await participant.locator('textarea:visible').fill('Self-service payment');
  const response = participant.waitForResponse(r => r.url().includes('/setUserPaymentRequestToCheck/') && r.request().method() === 'PATCH');
  await participant.getByRole('button', { name: 'Transferred!', exact: true }).click();
  expect((await response).status()).toBe(200);
  await expect(participant.getByText('Your request to check payment has been accepted, please await confirmation.', { exact: true })).toBeVisible();
  await expect(participant.getByRole('button', { name: 'Transferred!', exact: true })).toHaveCount(0);
  await expect.poll(() => data.payment(data.participant.email)).toMatchObject({ count: 1, pending: true, admissions: 0 });
  await login(chief, data.chief.email);
  await reviewPayment(chief, data.competition, data.participant.email, true);
  await expect.poll(() => data.payment(data.participant.email)).toMatchObject({ paid: true, admissions: 1, rows: 1 });
  await participant.reload();
  await expect(participant.getByRole('heading', { name: /You are.*participant!/i })).toBeVisible();
  await expect(participant.getByRole('button', { name: 'Participate', exact: true })).toBeHidden();
});
