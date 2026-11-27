// .env é opcional (ver .env.example). Carregado aqui para valer em config, fixtures e testes.
try { process.loadEnvFile?.('.env'); } catch { /* sem .env: usa os padrões */ }

/** Configuração centralizada. Nenhuma credencial é lida daqui. */
export const env = {
  baseURL: process.env.BASE_URL ?? 'https://automationexercise.com',
  owner: (process.env.QA_OWNER ?? 'tester').replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'tester',
  isCI: !!process.env.CI,
} as const;
