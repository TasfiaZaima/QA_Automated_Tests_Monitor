import { test, expect } from '@playwright/test';

test('API Health Check - ReqRes', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users?page=2');

  expect(response.ok()).toBeTruthy();

  const body = await response.json();

  expect(body.page).toBe(2);
  expect(body.data.length).toBeGreaterThan(0);
});