// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Work item 102 — Search events by keyword', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('event-card')).toHaveCount(6);
  });

  const search = async (page, text) => {
    await page.getByRole('searchbox', { name: 'Search events' }).fill(text);
    await page.getByRole('button', { name: 'Search' }).click();
  };

  test('AC3: search box and button are present', async ({ page }) => {
    await expect(page.getByRole('searchbox', { name: 'Search events' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
  });

  test('AC3: submitting a keyword shows only matching events (case-insensitive)', async ({ page }) => {
    await search(page, 'WORKSHOP');
    await expect(page.getByTestId('event-card')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Data Visualization Workshop' })).toBeVisible();
  });

  test('AC1: keyword in the description matches, surrounding whitespace ignored', async ({ page }) => {
    await search(page, '  internships  ');
    await expect(page.getByTestId('event-card')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Cloud Careers Panel' })).toBeVisible();
  });

  test('AC4: no matches shows the empty-state message', async ({ page }) => {
    await search(page, 'quantum basket weaving');
    await expect(page.getByTestId('event-card')).toHaveCount(0);
    await expect(page.getByRole('status')).toHaveText('No events match your search.');
  });

  test('AC5: clearing the search shows all events again', async ({ page }) => {
    await search(page, 'hackathon');
    await expect(page.getByTestId('event-card')).toHaveCount(1);
    await search(page, '');
    await expect(page.getByTestId('event-card')).toHaveCount(6);
    await expect(page.getByRole('status')).toHaveText('');
  });
});
