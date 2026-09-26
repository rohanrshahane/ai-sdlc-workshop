// Removes old test results so each run produces a fresh Allure report.
import { rmSync } from "node:fs";
for (const dir of ["allure-results", "allure-report", "test-results"]) {
  rmSync(dir, { recursive: true, force: true });
}
console.log("Cleaned allure-results, allure-report and test-results.");
