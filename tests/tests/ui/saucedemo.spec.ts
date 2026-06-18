import { test, expect } from '@playwright/test';

test('End-to-end shopping flow', async ({ page }) => {
  await page.goto('/');

  // Login
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  // Add Item to Cart
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // Checkout
  await page.locator('.shopping_cart_link').click();
  await page.locator('[data-test="checkout"]').click();

  // Filling checkout info
  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Doe');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();

  // Finish
  await page.locator('[data-test="finish"]').click();
  await expect(page.locator('.complete-header')).toHaveText(
    'Thank you for your order!'
  );
});