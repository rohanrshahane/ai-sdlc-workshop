// @ts-check
// Facilitator demo: run `npm run demo:failure` to force one failing test so the
// Allure report shows a screenshot and a video of the failure. Skipped otherwise.
const { test, expect } = require('@playwright/test');

test.describe('Demo — what a failure looks like in Allure', () => {
  test.skip(!process.env.DEMO_FAILURE, 'Set DEMO_FAILURE=1 to run this demo');

  test('expects a heading that does not exist', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500); // gives the video something to show
    await expect(page.getByRole('heading', { name: 'Campus Concerts' })).toBeVisible({ timeout: 3000 });
  });
});
