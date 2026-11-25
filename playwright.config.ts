import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  globalSetup: './tests/fixtures.ts',
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: {
    browserName: 'chromium',
    launchOptions: { executablePath: process.env.CP360_CHROMIUM || undefined },
    reducedMotion: 'reduce',
  },
})
