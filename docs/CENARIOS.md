# Cenários de teste

Os cenários estão escritos em Gherkin na pasta [`features/`](../features/), com um arquivo por frente do desafio.

| Frente | Arquivo | Técnicas | Automatizados | Manuais |
|---|---|---|---|---|
| 1. Carrinho de visitante | `ui/carrinho-visitante.feature` | partição de equivalência, valor limite, transição de estado | 5 | 3 |
| 2. Catálogo e busca | `ui/catalogo-busca.feature`, `api/catalogo.feature` | comparação tela x API, partição de equivalência | 9 | 2 |
| 3. API de conta | `api/conta.feature`, `api/metodos-nao-suportados.feature` | transição de estado, tabela de decisão, métodos inválidos | 7 | 2 |
| 4. Compra de ponta a ponta | `e2e/compra-ponta-a-ponta.feature` | fluxo de caso de uso | 1 | 2 |
| **Total** | | | **22** | **9** |

**Tags dos cenários:**

| Tag | Significado |
|---|---|
| `@frente-1` a `@frente-4` | frente do desafio |
| `@automatizado` / `@manual` | se o cenário tem teste na suíte ou é executado manualmente |
| `@smoke` | conjunto rápido |
| `@falha-esperada` + `@OBS-xxx` | falha hoje por um defeito registrado em [OBSERVACOES.md](OBSERVACOES.md) |

## Por que alguns ficaram manuais
- **Dependem de resposta do PO:** limite de quantidade (P01), acentos na busca (P04), validação do cadastro (P09) e compra de visitante (P02).
- **Mesmo defeito de um cenário automatizado:** a quantidade zero (OBS-002) tem a mesma causa da quantidade negativa, que já é automatizada.
- **Achados da exploração, com evidência em `docs/evidencias/`:** marcas repetidas (OBS-008) e formato de erro das rotas de conta (OBS-007).
- **Verificado só na exploração:** o mesmo produto somar na mesma linha.
- **Não automatizado por segurança:** confirmação e fatura sem pagamento (OBS-011), para não gerar comprovantes falsos no ambiente compartilhado.

Os `.feature` são a especificação. A automação está em Playwright, em `tests/`, e o cabeçalho de cada `.feature` indica o arquivo de teste correspondente.
