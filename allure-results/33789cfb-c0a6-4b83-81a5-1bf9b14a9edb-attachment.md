# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\api\health.spec.ts >> API Health Check - ReqRes
- Location: tests\tests\api\health.spec.ts:3:5

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('API Health Check - ReqRes', async ({ request }) => {
  4  |   const response = await request.get('https://reqres.in/api/users?page=2');
  5  | 
> 6  |   expect(response.ok()).toBeTruthy();
     |                         ^ Error: expect(received).toBeTruthy()
  7  | 
  8  |   const body = await response.json();
  9  | 
  10 |   expect(body.page).toBe(2);
  11 |   expect(body.data.length).toBeGreaterThan(0);
  12 | });
```