// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Work item 104 — Event date and time shown in raw format', () => {
  test('AC1: event card shows the friendly date and time, not the raw value', async ({ page }) => {
    await page.goto('/');
    const card = page.getByTestId('event-card').filter({ hasText: 'Intro to Machine Learning' });
    await expect(card.locator('.when')).toHaveText('Mon, Oct 12, 2026 · 6:00 PM');
    await expect(card).not.toContainText('2026-10-12 18:00');
  });

  test('AC2: a 12:30 event shows as PM', async ({ page }) => {
    await page.goto('/');
    const card = page.getByTestId('event-card').filter({ hasText: 'Cloud Careers Panel' });
    await expect(card.locator('.when')).toHaveText('Thu, Oct 15, 2026 · 12:30 PM');
  });
});
