import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

export default defineConfig({
  testDir: './tests',
  globalSetup: './src/config/global-setup.ts',
  fullyParallel: true,
  forbidOnly: env.isCI,
  // Ambiente de terceiros e compartilhado: paralelismo baixo para não sobrecarregar nem gerar flakiness.
  workers: 2,
  // Retry só no CI. Teste que passa só no retry aparece como "flaky" no relatório.
  retries: env.isCI ? 1 : 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    // Resultados para o Allure: `npm run allure` gera e abre o relatório.
    ['allure-playwright', {
      resultsDir: 'allure-results',
      detail: true,
      environmentInfo: { QA: 'Anderson Galvão', site: env.baseURL, navegador: 'Chromium', node: process.version },
    }],
  ],
  use: {
    baseURL: env.baseURL,
    locale: 'en-US',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'api', testDir: './tests/api' },
    { name: 'ui', testDir: './tests/ui', use: { ...devices['Desktop Chrome'] } },
  ],
});
