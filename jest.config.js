/** Unit tests write Allure results next to the Playwright ones, so one report covers both. */
module.exports = {
  testMatch: ['<rootDir>/tests/unit/**/*.test.js'],
  testEnvironment: 'allure-jest/node',
  testEnvironmentOptions: {
    resultsDir: 'allure-results',
  },
};
