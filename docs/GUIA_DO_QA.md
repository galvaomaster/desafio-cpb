# 📘 Guia do QA

> Para quem acabou de baixar o projeto e quer entender **requisitos, cenários e testes** sem se perder.
> Tempo de leitura: cerca de 15 minutos.

## 📑 Neste guia

- [🧠 O projeto em 2 minutos](#-o-projeto-em-2-minutos)
- [🔗 O fio condutor: do requisito ao bug](#-o-fio-condutor-do-requisito-ao-bug)
- [🏁 Seu primeiro dia: checklist](#-seu-primeiro-dia-checklist)
- [📖 Como ler um teste](#-como-ler-um-teste)
- [➕ Como adicionar um teste novo](#-como-adicionar-um-teste-novo)
- [🐞 Como registrar um bug](#-como-registrar-um-bug)
- [📚 Glossário](#-glossário)
- [🆘 Problemas comuns](#-problemas-comuns)

---

## 🧠 O projeto em 2 minutos

Um fornecedor vai entregar uma **loja virtual** ao CPB. O papel do QA é dizer se ela pode ser aceita e o que precisa ser corrigido antes.

Não existe documento de requisitos, então o trabalho seguiu estes passos:

1. **Pensar nos riscos** → [docs/PLANEJAMENTO.md](PLANEJAMENTO.md)
2. **Definir o que é correto** (os requisitos) → [requisitos/requisitos.md](../requisitos/requisitos.md)
3. **Escrever os cenários** que verificam cada requisito → [features/](../features/)
4. **Automatizar** os cenários mais importantes → [tests/](../tests/)
5. **Registrar os bugs** encontrados → [docs/OBSERVACOES.md](OBSERVACOES.md)

Tudo é organizado nas **4 frentes** do desafio:

| | Frente | Requisitos | Cenários | Testes |
|---|---|---|---|---|
| 🛒 | 1. Carrinho de visitante | RQ-1.x | `features/ui/carrinho-visitante.feature` | `tests/ui/cart.spec.ts` |
| 🔎 | 2. Catálogo e busca | RQ-2.x | `features/ui/catalogo-busca.feature`<br>`features/api/catalogo.feature` | `tests/ui/catalog.spec.ts`<br>`tests/api/catalog.api.spec.ts` |
| 👤 | 3. API de conta | RQ-3.x e RQ-5.x | `features/api/conta.feature`<br>`features/api/metodos-nao-suportados.feature` | `tests/api/account.api.spec.ts`<br>`tests/api/methods.api.spec.ts` |
| 💳 | 4. Compra ponta a ponta | RQ-4.x | `features/e2e/compra-ponta-a-ponta.feature` | `tests/ui/purchase.spec.ts` |

---

## 🔗 O fio condutor: do requisito ao bug

Todo teste do projeto existe por causa de um **requisito**. Quando o sistema não cumpre o requisito, o resultado é um **bug** registrado. Veja um exemplo real, seguindo a quantidade negativa no carrinho:

```text
 🧾 Requisito          🥒 Cenário             🧪 Teste               🐞 Observação
 RQ-1.3          ──►  "Quantidade negativa ──► "quantidade negativa ──► OBS-003
 quantidade ≥ 1        não entra no            não entra no           total negativo
                       carrinho"               carrinho"              (severidade Alta)
```

**1. 🧾 O requisito** ([requisitos.md](../requisitos/requisitos.md)) diz o que é correto e por quê:

| ID | Comportamento esperado | Por quê | Hoje |
|---|---|---|---|
| RQ-1.3 | Quantidade só inteira e ≥ 1, validada no servidor | 0 cria item fantasma, e negativo gera total negativo | ❌ OBS-002, OBS-003 |

**2. 🥒 O cenário** ([carrinho-visitante.feature](../features/ui/carrinho-visitante.feature)) descreve o comportamento em linguagem simples, em Gherkin:

```gherkin
@automatizado @falha-esperada @OBS-003
Cenário: Quantidade negativa não entra no carrinho
  Quando adiciono um produto com quantidade -1
  Então o produto não aparece no carrinho
```

**3. 🧪 O teste** ([cart.spec.ts](../tests/ui/cart.spec.ts)) executa o cenário no navegador. Ele tem o mesmo nome do cenário.

**4. 🐞 A observação** ([OBSERVACOES.md](OBSERVACOES.md#obs-003-carrinho-aceita-quantidade-negativa-e-gera-total-negativo)) registra o bug com passos, resultado esperado e obtido, impacto, sugestão de correção e print.

> 💡 **Dica:** para achar o teste de um cenário, abra o `.feature`: a primeira linha do arquivo diz qual arquivo de teste o implementa. Depois procure pelo nome do cenário dentro desse arquivo.

---

## 🏁 Seu primeiro dia: checklist

- [ ] **Instalar:** siga a seção [🚀 Acesso ao Projeto](../README.md#-acesso-ao-projeto) do README.
- [ ] **Rodar o smoke:** `npm run test:smoke` deve terminar com `6 passed`.
- [ ] **Ver os testes rodando:** `npx playwright test --ui` abre o modo interativo. Clique em um teste e veja cada passo no navegador.
- [ ] **Abrir o relatório:** `npm run allure` mostra os testes agrupados por frente.
- [ ] **Seguir um exemplo:** escolha um requisito em [requisitos.md](../requisitos/requisitos.md) e encontre o cenário e o teste dele.
- [ ] **Ler as observações:** em [OBSERVACOES.md](OBSERVACOES.md), veja como um bug é documentado.

---

## 📖 Como ler um teste

Este é o primeiro teste do carrinho, com explicações:

```ts
// 1. O teste pede o que precisa: a lista de produtos (da API) e as telas que vai usar.
test('produto adicionado aparece com nome, preço, quantidade e total',
  { tag: ['@smoke', '@regression'] },                // 2. Tags: entra no smoke e na regressão
  async ({ products, productPage, cartPage }) => {

    const product = products[0];                     // 3. O produto vem da API, nada é fixo

    await productPage.addToCart(product.id, 1);      // 4. Ação na tela, pelo Page Object
    await cartPage.open();

    expect(await cartPage.readRow(product.id)).toEqual({   // 5. Verificação: a tela = a API
      name: product.name,
      price: product.price,
      quantity: '1',
      total: product.price,
    });
});
```

**O que cada peça faz:**

| Peça | Onde fica | O que faz |
|---|---|---|
| `products`, `account`, `api` | `src/fixtures/index.ts` | **fixtures:** entregam dados prontos. A `account` cria uma conta antes do teste e apaga depois |
| `productPage`, `cartPage`… | `src/pages/` | **Page Objects:** guardam os seletores e as ações de cada tela |
| `expect(...)` | no próprio teste | **verificação:** o que define se o teste passa ou falha |
| `{ tag: [...] }` | no próprio teste | **tags:** separam smoke, regressão e falhas esperadas |

---

## ➕ Como adicionar um teste novo

Siga sempre esta ordem: **requisito → cenário → teste**.

1. **🧾 Requisito:** adicione uma linha em [requisitos.md](../requisitos/requisitos.md), na frente certa, com o comportamento esperado e o motivo.
2. **🥒 Cenário:** escreva o cenário no `.feature` da frente, com a tag `@automatizado` (ou `@manual`, se não for automatizar).
3. **🧪 Teste:** no arquivo de teste da frente, crie o teste com o **mesmo nome** do cenário. Use as fixtures e os Page Objects que já existem.
4. **🏷️ Tags:** use `@regression` sempre, e `@smoke` só se for o caminho principal da frente.
5. **▶️ Rodar:** rode só o seu teste com `npx playwright test -g "nome do teste"` e depois a suíte toda com `npm test`.

> 📏 **Regras que todo teste deve seguir:**
> - **Nenhum valor fixo:** IDs, nomes e preços vêm da API (fixture `products`).
> - **Nenhuma espera fixa (`sleep`):** espere por algo acontecer (um elemento, uma URL, uma resposta).
> - **Contas só pela fixture `account`:** ela cria a conta e apaga no final, mesmo se o teste falhar.
> - **Dados fictícios:** prefixo `QA_` e e-mail `@example.com`, nunca dados reais.

---

## 🐞 Como registrar um bug

Achou um comportamento errado? Antes de registrar, **reproduza de novo** e guarde a evidência (print ou requisição). Sem evidência, a observação não conta.

Depois, adicione em [OBSERVACOES.md](OBSERVACOES.md) seguindo o modelo:

| Campo | Exemplo |
|---|---|
| **Tipo** | bug, regra que falta, melhoria ou risco |
| **Passos** | o que fazer para ver o problema |
| **Esperado** | o que deveria acontecer (de acordo com o requisito) |
| **Obtido** | o que aconteceu de fato |
| **Severidade** | Alta, Média ou Baixa |
| **Impacto** | o que isso causa para o negócio |
| **Sugestão** | como o fornecedor pode corrigir |
| **Evidência** | print em `docs/evidencias/` ou a requisição e a resposta |

Se o bug tiver um teste automatizado, marque o teste como **falha esperada**:

```ts
test('quantidade negativa não entra no carrinho', { tag: ['@regression', '@known-bug'] }, async (...) => {
  test.fail(true, 'OBS-003: o carrinho aceita quantidade -1 e mostra total negativo');
  // ... resto do teste, verificando o comportamento CORRETO
});
```

---

## 📚 Glossário

| Termo | Significado |
|---|---|
| **Smoke** | conjunto pequeno e rápido de testes do caminho principal. Se falhar, nem vale rodar o resto |
| **Regressão** | todos os testes. Confere que nada que funcionava quebrou |
| **Oráculo** | a fonte da "resposta certa". Aqui, a **API** é o oráculo da tela |
| **Page Object** | classe que representa uma tela, com os seus seletores e ações |
| **Fixture** | algo que o teste recebe pronto (dados, telas, uma conta) e que é limpo depois |
| **Data-driven** | o mesmo teste rodando com dados diferentes (por exemplo, as quantidades 1, 2 e 5) |
| **Falha esperada** | teste que falha hoje por um bug conhecido; marcado com `test.fail()` e a tag `@known-bug` |
| **Flaky** | teste instável, que às vezes passa e às vezes falha sem mudança no código |
| **E2E** | *end-to-end*, ponta a ponta: o fluxo completo, como o usuário faria |
| **Gherkin** | linguagem dos cenários: `Dado` (contexto), `Quando` (ação), `Então` (resultado) |
| **PO** | *Product Owner*, quem decide as regras de negócio |

---

## 🆘 Problemas comuns

<details>
<summary><b>❓ Apareceu "Executable doesn't exist" ao rodar os testes</b></summary>

O navegador não foi baixado. Rode `npx playwright install chromium`.
</details>

<details>
<summary><b>❓ Alguns testes aparecem com ✘, mas o resultado final diz "passed"</b></summary>

São as **falhas esperadas** (`@known-bug`). Elas provam bugs que ainda existem e, por isso, contam como aprovadas. Está tudo certo.
</details>

<details>
<summary><b>❓ Um teste com @known-bug ficou vermelho: "expected to fail, but passed"</b></summary>

Boa notícia: o fornecedor corrigiu o bug. Remova a linha `test.fail(...)` e a tag `@known-bug` do teste, e atualize a observação em OBSERVACOES.md.
</details>

<details>
<summary><b>❓ Um teste falhou de forma aleatória (timeout, elemento não encontrado)</b></summary>

O site é público e compartilhado, então às vezes fica lento. Rode o teste de novo. Se falhar sempre, abra o relatório (`npm run report`): ele traz o vídeo e o trace com o passo exato que falhou.
</details>

<details>
<summary><b>❓ O carrinho ficou travado no meu navegador</b></summary>

O carrinho de visitante fica guardado no navegador. Limpe os dados do site e continue. Nos testes isso não acontece, porque cada teste abre um navegador novo.
</details>

---

<p align="center">
  Ficou alguma dúvida? Veja também <a href="ESTRUTURA.md">🏗️ Estrutura</a> e <a href="../DECISOES.md">🧭 Decisões</a>.
</p>
