import { defineConfig } from 'allure';

// Configuração do relatório Allure (Allure 3, roda em Node, não precisa de Java).
export default defineConfig({
  name: 'Desafio QA CPB - Loja virtual do fornecedor',
  output: './allure-report',
  // Guarda o resultado de cada execução para mostrar histórico e tendência no relatório.
  historyPath: './allure-history/history.jsonl',
  plugins: {
    awesome: {
      options: {
        // Árvore: projeto (api/ui) > arquivo > grupo de testes
        groupBy: ['parentSuite', 'suite', 'subSuite'],
      },
    },
  },
});
