# QA Automated Tests Monitor

Playwright-based QA monitoring for UI and API health checks. The tests run automatically in GitHub Actions on code changes and on a nightly schedule, with Allure reporting and Discord alerts for failures.

## Automation at a glance

| Event | Workflow | What happens | Discord notification |
| --- | --- | --- | --- |
| Push to `main` or `master` | `playwright.yml` | UI and API tests run; the Playwright report is uploaded as an artifact | No |
| Pull request targeting `main` or `master` | `playwright.yml` | UI and API tests run to validate the proposed changes | No |
| Every day at `15:30 UTC` (`21:30` Bangladesh time) | `qa-monitor.yml` | Full QA suite runs, Allure history is generated, and the dashboard is deployed to GitHub Pages | Custom failure alert; success may also appear through the GitHub/Discord integration |
| Manual **Run workflow** | `qa-monitor.yml` | The nightly QA monitoring workflow runs immediately | Custom failure alert; success may also appear through the GitHub/Discord integration |
| Push to `main` | `static.yml` | The Playwright report is deployed to GitHub Pages | No |

The main purpose of this project is to catch regressions automatically after commits and pull requests, while the nightly monitor provides an additional daily health check. Discord can show both successful and failed `main` workflow runs when the repository is connected through a GitHub/Discord integration. In addition, the QA monitor workflow sends its own custom alert when the scheduled or manually triggered test execution fails.

## What is covered

### UI test

The SauceDemo end-to-end test verifies the complete shopping flow:

1. Log in with a standard user
2. Add the Sauce Labs Backpack to the cart
3. Start checkout
4. Submit customer information
5. Complete the order and verify the confirmation message

### API test

The JSONPlaceholder health check verifies that:

- The endpoint returns HTTP `200`
- The returned post has ID `1`
- The post contains a title

## Prerequisites

- Node.js 18 or later
- npm

## Installation

Install the project dependencies:

```bash
npm install
npx playwright install
```

## Running the tests

Run all tests:

```bash
npx playwright test
```

Run only the UI test:

```bash
npx playwright test tests/tests/ui/saucedemo.spec.ts
```

Run only the API test:

```bash
npx playwright test tests/tests/api/health.spec.ts
```

Run tests with the browser visible:

```bash
npx playwright test --headed
```

Run the Chromium project explicitly:

```bash
npx playwright test --project=chromium
```

## Reports

The Playwright configuration produces both HTML and Allure reports.

Open the HTML report after a test run:

```bash
npx playwright show-report
```

Generate and open the Allure report, if Allure is installed:

```bash
allure generate allure-results -o allure-report --clean
allure open allure-report
```

Generated reports and test results are excluded from Git by `.gitignore`.

## GitHub Actions and scheduled monitoring

The repository includes GitHub Actions workflows under `.github/workflows/`.

### Nightly QA monitor

`qa-monitor.yml` runs the complete QA suite automatically every day at `15:30 UTC`, which is `21:30` in Bangladesh time (UTC+6). It can also be started manually from the GitHub Actions tab with **Run workflow**.

The scheduled workflow:

1. Installs dependencies and Chromium
2. Runs the Playwright UI and API tests
3. Builds an Allure report with historical results
4. Publishes the report to GitHub Pages
5. Sends a Discord notification when the test run fails

Live dashboard:

```text
https://tasfiazaima.github.io/QA_Automated_Tests_Monitor/
```

### Discord notifications

Failure notifications use a GitHub Actions secret named `DISCORD_WEBHOOK`. To configure it:

1. Create a Discord webhook for the target channel.
2. Open the repository's **Settings → Secrets and variables → Actions**.
3. Add an Actions secret named `DISCORD_WEBHOOK` containing the webhook URL.

The custom Discord step in `qa-monitor.yml` runs only when the scheduled or manually triggered test execution fails. If successful `main` runs also appear in Discord, those messages are produced by the repository's GitHub/Discord integration rather than this custom failure step.

### Other workflows

- `playwright.yml` runs tests on pushes and pull requests targeting `main` or `master` and uploads the Playwright HTML report as an artifact.
- `static.yml` deploys the Playwright report to GitHub Pages when changes are pushed to `main`.

## Project structure

```text
.
├── .github/
│   └── workflows/
│       ├── playwright.yml
│       ├── qa-monitor.yml
│       └── static.yml
├── tests/
│   └── tests/
│       ├── api/
│       │   └── health.spec.ts
│       └── ui/
│           └── saucedemo.spec.ts
├── playwright.config.ts
├── package.json
└── README.md
```

## Configuration

The Playwright configuration currently uses:

- Chromium with Desktop Chrome settings
- Base URL: `https://www.saucedemo.com`
- Fully parallel test execution
- Two retries on failure
- Screenshots only on failure
- Traces on the first retry
- HTML and Allure reporters

## Test credentials

The UI test uses SauceDemo's standard test account:

```text
Username: standard_user
Password: secret_sauce
```

These credentials are intended for the public SauceDemo demo site and are not production credentials.
