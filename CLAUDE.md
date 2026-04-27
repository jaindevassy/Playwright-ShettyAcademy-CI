# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm ci

# Install Playwright browsers (first time or after updates)
npx playwright install --with-deps chromium

# Run all tests
npm test

# Run smoke tests only (requires auth setup dependency)
npm run test:smoke

# Run regression tests only
npm run test:regression

# Run a single test file
npx playwright test tests/smokeTest.spec.ts

# Run a single test by title
npx playwright test --grep "add ZARA COAT 3"

# Run tests headed (visible browser)
npm run test:headed

# View HTML report
npm run report:html

# Generate and open Allure report
npm run allure:report
```

## Environment Variables

Tests require a `.env` file in the project root with these variables:

```
BASE_URL=<app URL>
API_BASE_URL=<API base URL>
USER_EMAIL=<test user email>
USER_PASSWORD=<test user password>
```

In CI these are injected as GitHub secrets.

## Architecture

### Test Projects (playwright.config.ts)

Three Playwright projects are configured:

- **`setup`** — runs `auth.setup.ts`, logs in via UI and saves storage state to `.auth/user.json`
- **`smoke-tests`** — depends on `setup`; loads saved auth state; runs `smokeTest.spec.ts` only
- **`regression-tests`** — standalone; runs all specs except `auth.setup.ts` and `smokeTest.spec.ts`

### Page Object Model

All pages live in `pages/` and follow constructor-injection of `Page`:

| File | Responsibility |
|---|---|
| `LoginPage.ts` | Login form interactions |
| `DashboardPage.ts` | Product listing, add-to-cart, navigation |
| `CartPage.ts` | Cart review, proceed to checkout |
| `CheckoutPage.ts` | Country selection, place order, confirmation |
| `OrdersPage.ts` | Orders table, view/delete order by ID |
| `pages/api/ApiUtils.ts` | API helper: login, create/get/delete orders, product lookup |

### Fixtures

`fixtures/baseTest.ts` extends `@playwright/test` with typed fixtures for every page object (`loginPage`, `dashboardPage`, `cartPage`, `checkoutPage`, `ordersPage`, `apiUtils`). All test files import `test` and `expect` from this fixture file, not directly from `@playwright/test`.

### Test Suites

- `tests/smokeTest.spec.ts` — tagged `@Smoke`; UI-only flows using stored auth session
- `tests/regressionTest.spec.ts` — tagged `@Regression`; hybrid API-setup + UI-verification pattern: injects token into `localStorage`, intercepts the products API response to capture a real product ID, creates an order via API, then verifies it in the UI
- `tests/auth.setup.ts` — auth setup fixture, not a test suite; saves browser storage state

### Test Data

`tests/testData/regressionData.json` holds product name, payment details, and expected email for the regression E2E flow.

### CI

`.github/workflows/smoke-tests.yml` triggers on PRs to `master` or `dev`, runs only the smoke suite, then uploads Allure and Playwright HTML reports as artifacts (retained 14 days).

### Reporting

Two reporters run in parallel: `allure-playwright` (outputs to `allure-results/`) and Playwright's built-in `html` reporter (outputs to `playwright-report/`).
