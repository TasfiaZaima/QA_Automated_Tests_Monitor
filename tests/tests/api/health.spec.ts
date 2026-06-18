import { test, expect } from '@playwright/test';

test('API Health Check - JSONPlaceholder', async ({ request }) => {
  // JSONPlaceholder is much more stable than ReqRes
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

  // Verify it is successful (Status 200)
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.id).toBe(1);
  expect(body.title).toBeDefined();
});