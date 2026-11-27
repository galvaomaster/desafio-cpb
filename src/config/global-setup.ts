import { rmSync } from 'node:fs';

/** Roda uma vez antes de cada execução: limpa os resultados do Allure da execução anterior. */
export default function globalSetup() {
  rmSync('allure-results', { recursive: true, force: true });
}
