# QA Automated Tests Monitor

Playwright-based QA monitoring for UI and API health checks. The tests run automatically in GitHub Actions on code changes and on a nightly schedule, with Allure reporting, GitHub Pages deployments, Discord workflow/check notifications, and custom failure alerts.

## Automation at a glance

This project runs automated QA checks through GitHub Actions at several points in the development cycle.

- When code is pushed to `main`, `playwright.yml` runs the UI and API tests and stores the Playwright HTML report as an artifact.
- When a pull request targets `main`, `playwright.yml` runs the same tests to validate the proposed changes before they are merged.
- When code is pushed to `main`, `static.yml` runs the tests and deploys the generated Playwright report to GitHub Pages.
- Every day at `15:30 UTC` (`21:30` Bangladesh time), `qa-monitor.yml` runs the full QA suite, builds the Allure report with history, and deploys the dashboard to GitHub Pages.
- The nightly monitor can also be started manually from the GitHub Actions tab with **Run workflow**.

The main purpose of this project is to catch regressions automatically after commits and pull requests, while the nightly monitor provides an additional daily health check. Discord can show both successful and failed `main` workflow runs when the repository is connected through a GitHub/Discord integration.

Because multiple workflows can run for a push to `main`, Discord may show several messages for one commit, such as `test success`, `deploy success`, or `GitHub Actions checks success`. Failure messages can appear in the same way. These messages are workflow/check status notifications and are separate from the custom QA failure alert.

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

There are two Discord notification sources:

1. The repository's GitHub/Discord integration reports workflow and check statuses, including successful and failed `test`, `deploy`, and `monitor` runs.
2. The custom Discord step in `qa-monitor.yml` uses the `DISCORD_WEBHOOK` secret and runs when the scheduled or manually triggered test execution fails.

This is why both success and failure messages can appear, and why one run can produce more than one Discord message.

### GitHub email notifications

The repository does not contain an email-sending action. Emails are controlled by GitHub's notification settings. GitHub Actions can email the user who triggered a workflow when it completes, or email only for failed workflows if that preference is selected. Scheduled workflow notifications are associated with the user who created or last updated the schedule.

Notification preferences can be managed at **GitHub Settings → Notifications → System → Actions**. The available choices include email notifications, failed-workflow-only notifications, or no workflow emails.

### Other workflows

- `playwright.yml` runs tests on pushes and pull requests targeting `main` and uploads the Playwright HTML report as an artifact.
- `static.yml` runs the Playwright tests and deploys the resulting Playwright report to GitHub Pages when changes are pushed to `main`.

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
