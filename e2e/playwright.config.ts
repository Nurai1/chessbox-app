import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';
import { environment } from './support/environment';

// Keep each run, including successful videos, for later manual review.
// Workers load this config again; inherit the runner's directory instead of
// generating a second timestamp that separates videos from their HTML report.
process.env.E2E_RUN_ID ||= new Date().toISOString().replace(/[:.]/g, '-');
const artifacts = path.resolve(__dirname, 'artifacts', process.env.E2E_RUN_ID);

export default defineConfig({
  testDir: './specs',
  outputDir: path.join(artifacts, 'results'),
  fullyParallel: true,
  workers: 2,
  timeout: 120_000,
  expect: { timeout: 10_000 },
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: path.join(artifacts, 'report') }]],
  use: {
    baseURL: environment.web,
    locale: 'en-US',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'on',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'node -r ts-node/register/transpile-only index.ts',
      cwd: path.resolve(__dirname, '../server'),
      url: `${environment.api}/api/competitions`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        MONGO_URI: environment.mongo,
        PORT: '3001',
        IS_DOCKER: 'true',
        CLIENT_URL: environment.web,
        JWT_SECRET_KEY: 'local-e2e-only-not-a-production-secret',
        SMTP_HOST: '127.0.0.1',
        SMTP_PORT: '1025',
        SMTP_SECURE: 'false',
        SMTP_USER_MAIL: 'sender@e2e.test',
        SMTP_SERVICE_PASSKEY: '',
      },
    },
    {
      command: 'node node_modules/vite/bin/vite.js --host localhost --port 5173 --strictPort',
      cwd: path.resolve(__dirname, '../client'),
      url: environment.web,
      reuseExistingServer: false,
      timeout: 120_000,
      env: { VITE_ENVIRONMENT: 'local', VITE_E2E: '1' },
    },
  ],
});
