import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration.
 * Runs tests against the Vite dev server (npm run dev).
 * WebKit project is the primary target for the Safari glyph-rendering regression.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
  workers: 1,
  projects: [
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        launchOptions: {
          args: ['--disable-webgl', '--disable-3d-apis'],
        },
      },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  /* Start the Vite dev server before running tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
