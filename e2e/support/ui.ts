import { expect, Locator, Page } from '@playwright/test';
import { Competition, password } from './data';

export const token = (page: Page) => page.evaluate(() => sessionStorage.getItem('AUTH_JWT_TOKEN_KEY'));

export async function login(page: Page, email: string) {
  await page.goto('/#/signin');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  const response = page.waitForResponse(r => r.url().endsWith('/api/login') && r.request().method() === 'POST');
  await page.locator('form').getByRole('button', { name: 'Sign In', exact: true }).click();
  expect((await response).status()).toBe(200);
  await expect(page).toHaveURL(/#\/competitions$/);
  await expect.poll(() => token(page)).toBeTruthy();
}

export async function assertProfile(page: Page, email: string) {
  await page.goto('/#/edit-profile');
  await expect(page.locator('input[name="email"]')).toHaveValue(email);
}

export async function fillAccount(page: Page, email: string) {
  const lastName = `Student${email.split('+')[0].slice(-8)}`;
  const fields: Record<string, string> = {
    email,
    firstName: 'Playwright',
    lastName,
    weight: '75',
    birthDate: '15.01.2000',
    fightClub: 'E2E Club',
    country: 'Thailand',
    city: 'Bangkok',
    chessPlatformUserName: 'e2eplayer',
    password,
    passwordConfirm: password,
  };
  for (const [name, value] of Object.entries(fields)) {
    await page.locator(`form input[name="${name}"]`).fill(value);
  }
  await page.locator('form input[name="gender"]').click();
  await page.locator('form').getByRole('button', { name: 'Man', exact: true }).click();
}

export async function signup(page: Page, email: string) {
  await page.goto('/#/signup');
  await fillAccount(page, email);
  const response = page.waitForResponse(r => r.url().endsWith('/api/signup') && r.request().method() === 'POST');
  await page.locator('form').getByRole('button', { name: 'Sign Up', exact: true }).click();
  expect((await response).status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Email Confirmation', level: 1, exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Continue to sign in', exact: true })).toBeVisible();
  expect(await token(page)).toBeNull();
}

export async function openStudents(page: Page, competition: Competition) {
  await page.goto(`/#/coach/participants?competitionId=${competition._id}`);
  await expect(page.getByRole('heading', { name: 'Participant registration', exact: true })).toBeVisible();
  // Explicit tournament selection makes this independent of existing DB records.
  await expect(page.getByRole('main').locator('input[readonly]')).toHaveValue(new RegExp(competition.name), {
    timeout: 30_000,
  });
}

export async function searchParticipant(page: Page, name: string) {
  await page.locator('input[name="participantSearch"]').fill(name);
  await expect(studentCard(page, name)).toBeVisible();
}

export const studentCard = (page: Page, name: string) =>
  page.locator('article').filter({ has: page.getByRole('heading', { name, exact: true }) });

export async function requestPayment(page: Page, card: Locator, message: string) {
  await card.locator('textarea').fill(message);
  const response = page.waitForResponse(r => r.url().includes('/setUserPaymentRequestToCheck/') && r.request().method() === 'PATCH');
  await card.getByRole('button', { name: 'Request payment verification', exact: true }).click();
  expect((await response).status()).toBe(200);
  await expect(card.getByText('Request sent. Waiting for the chief judge to verify payment.', { exact: true })).toBeVisible();
  await expect(card.getByRole('button', { name: 'Request payment verification', exact: true })).toHaveCount(0);
}

export async function refreshStudents(page: Page) {
  const response = page.waitForResponse(r => r.url().endsWith('/api/competitions') && r.request().method() === 'GET');
  await page.getByRole('button', { name: 'Refresh statuses', exact: true }).click();
  expect((await response).ok()).toBeTruthy();
}

export async function reviewPayment(page: Page, competition: Competition, email: string, paid: boolean) {
  // A full navigation refreshes the chief's queue after another actor submits.
  await page.goto(`/#/competitions/${competition._id}/verify-payment`);
  await page.reload();
  await expect(page.getByRole('heading', { name: competition.name, exact: true })).toBeVisible();
  const row = page.getByTestId('payment-review').filter({ has: page.getByText(email, { exact: true }) });
  await expect(row).toBeVisible();
  const response = page.waitForResponse(r => r.url().includes('/setUserPaymentPaid/') && r.request().method() === 'PATCH');
  await row.getByRole('button', { name: paid ? 'Paid' : 'Not paid', exact: true }).click();
  expect((await response).status()).toBe(200);
  await expect(row.getByRole('button', { name: 'Paid', exact: true })).toHaveCount(0);
}
