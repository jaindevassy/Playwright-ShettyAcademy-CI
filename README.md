# Playwright-ShettyAcademy-CI

End-to-end test automation framework for [Rahul Shetty Academy](https://rahulshettyacademy.com/client) built with Playwright and TypeScript.

## Tech Stack

- Playwright with TypeScript
- Page Object Model (POM) architecture
- Allure reporting
- GitHub Actions CI (smoke tests on every PR)

## Setup

```bash
npm install
npx playwright install --with-deps chromium
```

## Run Tests

```bash
npm test                 # all tests
npm run test:smoke       # smoke tests only
npm run test:chromium    # chromium project only
npm run test:headed      # headed mode
```

## Environment Variables

Create a `.env` file in the project root:

```
BASE_URL=https://rahulshettyacademy.com/client
API_BASE_URL=https://rahulshettyacademy.com
USER_EMAIL=<your-email>
USER_PASSWORD=<your-password>
```
