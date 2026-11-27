# Estrutura do projeto

Como a automação do Desafio Prático de QA do CPB está organizada e como funciona. Se você acabou de chegar, comece pelo [Guia do QA](GUIA_DO_QA.md).

```
├── src/
│   ├── api/api-client.ts      chamadas da API
│   ├── pages/                 Page Objects (um por tela)
│   ├── fixtures/index.ts      prepara e limpa o que cada teste usa
│   ├── data/factories.ts      cria usuários fictícios e e-mails únicos
│   ├── data/test-data.ts      dados dos testes data-driven
│   ├── config/                variáveis de ambiente e limpeza antes de cada execução
│   └── utils/price.ts         converte "Rs. 500" em 500
├── tests/
│   ├── api/                   testes de API
│   └── ui/                    testes de tela (inclui comparação com a API e o E2E)
├── features/                  cenários em Gherkin (.feature)
├── requisitos/                comportamento esperado definido pelo QA
├── docs/                      guia do QA, planejamento, cenários, observações, evidências, uso de IA
├── playwright.config.ts       configuração dos testes e dos relatórios
├── allurerc.mjs               configuração do relatório Allure
└── .github/workflows/ci.yml   pipeline de CI
```

## Como funciona

**Fixtures** (`src/fixtures/index.ts`). O teste pede o que precisa pelo nome e recebe pronto:

| Fixture | O que entrega |
|---|---|
| `products` | a lista de produtos da API; os testes não escrevem ID nem preço |
| `account` | uma conta criada pela API antes do teste e **apagada depois, mesmo se ele falhar** |
| `api` | o cliente da API |
| `productsPage`, `productPage`, `cartPage`, `loginPage`, `checkoutPage`, `paymentPage` | os Page Objects |

A fixture `page` também bloqueia anúncios e fecha o pop-up de consentimento, que atrapalham os cliques.

**Cliente da API** (`src/api/api-client.ts`). Cada resposta guarda o status HTTP e o `responseCode` do corpo separados, para os testes compararem os dois. O método `deleteAccount` só apaga e-mails no padrão das contas de teste.

**Page Objects** (`src/pages/`). Guardam os seletores e as ações de cada tela (`addToCart`, `search`, `login`…). Não fazem verificações: o que está certo ou errado é decidido no teste.

**Testes.** Cada arquivo começa com "Frente N" e corresponde a um `.feature`:

| Teste | Cenários | Frente |
|---|---|---|
| `tests/ui/cart.spec.ts` | `features/ui/carrinho-visitante.feature` | 1 |
| `tests/ui/catalog.spec.ts` | `features/ui/catalogo-busca.feature` | 2 |
| `tests/api/catalog.api.spec.ts` | `features/api/catalogo.feature` | 2 |
| `tests/api/account.api.spec.ts` | `features/api/conta.feature` | 3 |
| `tests/api/methods.api.spec.ts` | `features/api/metodos-nao-suportados.feature` | 3 |
| `tests/ui/purchase.spec.ts` | `features/e2e/compra-ponta-a-ponta.feature` | 4 |

**Tags.**
- `@smoke`: testes rápidos;
- `@regression`: todos os testes;
- `@known-bug`: falha esperada, marcada com `test.fail()`. Enquanto o defeito existir, o teste conta como aprovado. Quando o fornecedor corrigir, ele fica vermelho e a marcação deve ser removida.

**Relatórios.**
- O **Playwright** gera `playwright-report/`, com trace, vídeo e print das falhas.
- O **Allure** usa os resultados gravados em `allure-results/` e gera `allure-report/` com `npm run allure`.

## Comandos

| Comando | O que faz |
|---|---|
| `npm test` | roda todos os testes |
| `npm run test:smoke` / `npm run test:regression` | roda o smoke ou a regressão |
| `npm run test:api` / `npm run test:ui` | roda só API ou só tela |
| `npm run report` | abre o relatório do Playwright |
| `npm run allure` | gera e abre o relatório Allure |

## Como adicionar um teste

1. Se for uma tela nova, crie o Page Object em `src/pages/` e registre-o em `src/fixtures/index.ts`.
2. Escreva o teste em `tests/api` ou `tests/ui`, com as tags `@regression` (e `@smoke`, se for um caminho principal).
3. Descreva o cenário no `.feature` da frente.
