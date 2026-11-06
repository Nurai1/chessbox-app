import { test, expect } from '../support/fixtures';
import { environment } from '../support/environment';

test('rating API and page exclude accounts without confirmed email', async ({ actor, data }) => {
  await data.users.updateOne({ _id: data.student._id }, { $set: { emailConfirmed: false } });
  const page = await actor();
  await page.goto('/#/rating');
  await expect(page.getByRole('heading', { name: 'Rating' })).toBeVisible();

  const search = page.getByPlaceholder('Search users');
  await search.fill(data.student.fullName);
  await expect(page.getByText('Nothing found', { exact: true })).toBeVisible();

  const excluded = await page.request.get(`${environment.api}/api/users`, {
    params: { role: 'participant', search: data.student.fullName },
  });
  expect(excluded.ok()).toBe(true);
  expect(await excluded.json()).toMatchObject({ items: [], total: 0 });

  await search.fill(data.otherStudent.fullName);
  await expect(page.getByText(data.otherStudent.fullName, { exact: true })).toBeVisible();
  const confirmed = await page.request.get(`${environment.api}/api/users`, {
    params: { role: 'participant', search: data.otherStudent.fullName },
  });
  expect(confirmed.ok()).toBe(true);
  const body = await confirmed.json();
  expect(body.total).toBe(1);
  expect(body.items.map((user: { _id: string }) => user._id)).toEqual([data.otherStudent._id.toString()]);
});
