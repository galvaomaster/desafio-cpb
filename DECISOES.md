# Decisões

**QA responsável:** Anderson Galvão

Este arquivo responde à seção 6 do enunciado do Desafio Prático de QA do CPB.

## Ferramenta: Playwright em vez de Cypress

O enunciado pede Cypress. Usei **Playwright + TypeScript**, que atende aos mesmos requisitos:

| Requisito do desafio | Como está atendido |
|---|---|
| Page Object Model | `src/pages/`, um arquivo por tela |
| Dados dinâmicos | produtos e preços lidos de `GET /api/productsList`, sem valor fixo nos testes |
| Testes independentes, sem `sleep` | um navegador novo por teste; só esperas por condição |
| Data-driven | `src/data/test-data.ts` |
| Limpeza mesmo com falha | a fixture `account` apaga a conta depois do teste |
| Smoke × regressão | tags `@smoke` e `@regression` |
| Falha esperada | `test.fail()` + tag `@known-bug` |

**Por que Playwright:** testa API e tela no mesmo projeto, sem plugin, e metade do escopo é API. Além disso, as fixtures garantem a limpeza e o trace e o vídeo servem de evidência. O desenho (cliente de API, Page Objects, fábricas de dados) pode ser levado para Cypress se a equipe padronizar nessa ferramenta.

## O que priorizei e por quê

- **A ordem segue o risco:** carrinho → conta → compra → catálogo. Dinheiro e dado pessoal vêm primeiro (ver [PLANEJAMENTO](docs/PLANEJAMENTO.md)).
- **A API é a referência.** O valor esperado na tela vem sempre da API.
- **A automação cobre o caminho principal de cada frente** mais o que o enunciado pede: data-driven, métodos inválidos, status HTTP × corpo, tela × API e o fluxo encadeado da conta.
- **Falha esperada só para bug reproduzido e com evidência.** Conferi que cada uma falha pelo motivo certo.

## O que ficou de fora e por quê

- **Telas fora das 4 frentes:** cadastro pela tela, filtros, avaliações, contato e newsletter.
- **Regras sem definição** (limite de quantidade, validação do cadastro): ficaram como cenários manuais até o PO responder.
- **Carga e testes de segurança:** o ambiente é de terceiros e compartilhado.
- **Outros navegadores e mobile:** o risco aqui é de regra de negócio, não de visual.

## Dados e isolamento em ambiente compartilhado

- **Toda conta é única e identificável:** nome `QA_<owner>_...`, e-mail `qa_<owner>_<timestamp>_<aleatório>@example.com` e senha gerada na hora.
- **Limpeza:** a conta é apagada ao final de cada teste, mesmo quando ele falha.
- **Trava de segurança:** o cliente da API se recusa a apagar e-mails fora desse padrão, então nunca apaga conta de outra pessoa.
- **Carrinho:** cada teste abre um navegador novo, então o carrinho de um teste não interfere no outro.
- **Carga no site:** só 2 testes em paralelo, para não sobrecarregar o site, e os anúncios são bloqueados porque atrapalham os cliques.

## Como reaproveitar em outras telas e equipes

- **Nova tela:** crie um Page Object e um arquivo de teste; as fixtures `api`, `products` e `account` já servem.
- **Várias equipes:** o código de `src/` pode virar um pacote interno compartilhado, e cada equipe mantém só os seus testes. Tags por área (`@carrinho`, `@conta`) permitem rodar só o que interessa a cada uma.
- **Convenções:** o prefixo `QA_`, a limpeza obrigatória e a marcação de falha esperada ficam documentados no README.

## Pipeline

O arquivo [`.github/workflows/ci.yml`](.github/workflows/ci.yml) tem dois estágios: **smoke → regressão**.

- **Quando roda:**
  - em pull request, só o smoke (6 testes, cerca de 20s);
  - no push para a `main`, todo dia útil e sob demanda, o smoke e depois a regressão completa.
- **O que bloqueia:**
  - o smoke bloqueia o merge;
  - a regressão não bloqueia, porque o site é de terceiros e pode oscilar. Ela gera o relatório para análise.
- **Teste instável:** há 1 nova tentativa só no CI. Um teste que passa só na segunda tentativa aparece como "flaky" no relatório e vira tarefa para corrigir a causa (seletor, espera ou dado), nunca com `sleep`. Se continuar instável, sai do smoke até ser corrigido.
- **Falha esperada:** quando o fornecedor corrigir um bug, o teste correspondente fica vermelho. Nesse momento, remove-se o `test.fail()` e fecha-se a observação.
- **Relatórios:** o Allure e o relatório do Playwright ficam salvos em cada execução.
