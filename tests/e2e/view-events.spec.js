// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Work item 101 — View upcoming events', () => {
  test('AC1: the home page lists every upcoming event', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Campus Events' })).toBeVisible();
    await expect(page.getByTestId('event-card')).toHaveCount(6);
  });

  test('AC2: each event shows its title, location and seats left', async ({ page }) => {
    await page.goto('/');
    const card = page.getByTestId('event-card').filter({ hasText: 'Resume Clinic' });
    await expect(card.getByRole('heading', { name: 'Resume Clinic' })).toBeVisible();
    await expect(card).toContainText('Career Center');
    await expect(card).toContainText('9 seats left');
  });

  test('AC3: a fully booked event is labelled Full', async ({ page }) => {
    await page.goto('/');
    const card = page.getByTestId('event-card').filter({ hasText: 'Hackathon Kickoff' });
    await expect(card.locator('.seats')).toHaveText('Full');
  });
});
