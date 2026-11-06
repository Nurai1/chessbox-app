import { test, expect } from '../support/fixtures';
import { password } from '../support/data';
import { assertProfile, login, signup, token } from '../support/ui';

test('desktop signup, email link on a phone, password login on both devices', async ({ actor, data, mailbox }) => {
  const desktop = await actor();
  const phone = await actor(true);
  const email = data.email('cross-device');
  await signup(desktop, email);
  expect((await data.user(email)).emailConfirmed).toBe(false);
  const link = await mailbox.confirmationLink(email);
  await phone.goto(link);
  await expect(phone.getByText('Email confirmed.', { exact: true })).toBeVisible();
  expect(await token(phone)).toBeNull();
  expect(await token(desktop)).toBeNull();
  expect(await data.user(email)).toMatchObject({ emailConfirmed: true, oneTimeCode: null });

  // Keep the original desktop tab, rather than reopening the signup flow.
  await desktop.getByRole('link', { name: 'Continue to sign in', exact: true }).click();
  await expect(desktop.locator('input[name="email"]')).toHaveValue(email);
  await desktop.locator('input[name="password"]').fill(password);
  await desktop.locator('form').getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(desktop).toHaveURL(/#\/competitions$/);
  await assertProfile(desktop, email);

  await phone.locator('main').getByRole('link', { name: 'Sign In', exact: true }).click();
  await expect(phone.locator('input[name="email"]')).toHaveValue(email);
  await phone.locator('input[name="password"]').fill(password);
  await phone.locator('form').getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(phone).toHaveURL(/#\/competitions$/);
  await assertProfile(phone, email);
});

test('unconfirmed account cannot sign in; the same browser can confirm and then sign in', async ({ actor, data, mailbox }) => {
  const page = await actor();
  const email = data.email('same-browser');
  await signup(page, email);
  const link = await mailbox.confirmationLink(email);
  await page.getByRole('link', { name: 'Continue to sign in', exact: true }).click();
  await page.locator('input[name="password"]').fill(password);
  const response = page.waitForResponse(r => r.url().endsWith('/api/login') && r.request().method() === 'POST');
  await page.locator('form').getByRole('button', { name: 'Sign In', exact: true }).click();
  expect((await response).status()).toBe(403);
  await expect(page.getByText('Please confirm your email before signing in.', { exact: true })).toBeVisible();
  expect(await token(page)).toBeNull();
  await page.goto(link);
  await expect(page.getByText('Email confirmed.', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Email confirmed.', { exact: true })).toBeVisible();
  expect(await token(page)).toBeNull();
  await login(page, email);
  await assertProfile(page, email);
});

test('opening and replaying a link preserves another user already signed in on the phone', async ({ actor, data, mailbox }) => {
  const desktop = await actor();
  const phone = await actor(true);
  const email = data.email('different-session');
  await login(phone, data.participant.email);
  const existingToken = await token(phone);
  await signup(desktop, email);
  const link = await mailbox.confirmationLink(email);
  await phone.goto(link);
  await expect(phone.getByText('Email confirmed.', { exact: true })).toBeVisible();
  expect(await token(phone)).toBe(existingToken);
  await phone.reload();
  await expect(phone.getByText('Email confirmed.', { exact: true })).toBeVisible();
  await assertProfile(phone, data.participant.email);
  expect(await token(phone)).toBe(existingToken);
  await login(desktop, email);
  await assertProfile(desktop, email);
});

for (const invalid of ['missing-code', 'wrong-code', 'unknown-email'] as const) {
  test(`invalid confirmation (${invalid}) leaves account unconfirmed and valid link still works`, async ({ actor, data, mailbox }) => {
    const desktop = await actor();
    const phone = await actor(true);
    const email = data.email(`invalid-${invalid}`);
    await signup(desktop, email);
    const link = await mailbox.confirmationLink(email);
    const broken = new URL(link);
    if (invalid === 'missing-code') broken.searchParams.delete('confirmationCode');
    if (invalid === 'wrong-code') {
      const original = Number(broken.searchParams.get('confirmationCode'));
      broken.searchParams.set('confirmationCode', String(original === 9999 ? 1000 : original + 1));
    }
    if (invalid === 'unknown-email') broken.searchParams.set('email', data.email('nonexistent'));
    await phone.goto(broken.toString());
    await expect(phone.getByText('The confirmation link is invalid. Make sure you opened the complete link from the email.', { exact: true })).toBeVisible();
    expect(await token(phone)).toBeNull();
    expect((await data.user(email)).emailConfirmed).toBe(false);
    await phone.goto(link);
    await expect(phone.getByText('Email confirmed.', { exact: true })).toBeVisible();
    await login(desktop, email);
    await assertProfile(desktop, email);
  });
}

test('the same email link can be opened concurrently in independent browsers', async ({ actor, data, mailbox }) => {
  const desktop = await actor();
  const email = data.email('parallel-open');
  await signup(desktop, email);
  const link = await mailbox.confirmationLink(email);
  const first = await actor(true);
  const second = await actor();
  await Promise.all([first.goto(link), second.goto(link)]);
  await expect(first.getByText('Email confirmed.', { exact: true })).toBeVisible();
  await expect(second.getByText('Email confirmed.', { exact: true })).toBeVisible();
  expect(await token(first)).toBeNull();
  expect(await token(second)).toBeNull();
  expect(await data.user(email)).toMatchObject({ emailConfirmed: true, oneTimeCode: null });
  await login(desktop, email);
  await assertProfile(desktop, email);
});
