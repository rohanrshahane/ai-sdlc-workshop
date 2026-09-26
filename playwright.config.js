// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const PORT = Number(process.env.E2E_PORT) || 3100;

// Optional: point Playwright at an existing Chromium binary (useful in locked-down labs).
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  reporter: [
    ['list'],
    ['allure-playwright', { resultsDir: 'allure-results', suiteTitle: true }],
  ],
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Failure evidence, as described in the paper (Layer 5):
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node src/server.js',
    env: { PORT: String(PORT) },
    url: `http://localhost:${PORT}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 20_000,
  },
});
