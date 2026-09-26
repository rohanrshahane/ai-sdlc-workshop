import { defineConfig } from "allure";

export default defineConfig({
  name: "Campus Events — AI-SDLC Workshop",
  output: "./allure-report",
  plugins: {
    awesome: {
      options: {
        reportName: "Campus Events — AI-SDLC Workshop",
        singleFile: false,
        groupBy: ["parentSuite", "suite", "subSuite"],
      },
    },
  },
});
