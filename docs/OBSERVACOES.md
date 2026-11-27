# Observações e melhorias

**QA responsável:** Anderson Galvão

Este é o diagnóstico do que precisa voltar para o fornecedor corrigir antes de o CPB aceitar o módulo (seção 5 do enunciado). Tudo foi reproduzido em 25 e 26/11/2026.

As evidências (prints e respostas da API) estão em [`docs/evidencias/`](evidencias/).

| ID | Título | Tipo | Severidade | Teste |
|---|---|---|---|---|
| OBS-011 | Pedido confirmado e fatura gerada sem pagamento, valor vindo da URL | bug | **Alta** | manual |
| OBS-003 | Quantidade negativa gera total negativo | bug | **Alta** | `cart.spec` › quantidade negativa |
| OBS-009 | Dado pessoal exposto sem autenticação | risco | **Alta** | `account.api.spec` › consulta sem autenticação |
| OBS-001 | HTTP 200 com erro no corpo | bug | Média | `catalog.api.spec`, `methods.api.spec` |
| OBS-002 | Quantidade 0 aceita | bug | Média | manual |
| OBS-005 | Sem teto de quantidade | regra que falta | Média | manual |
| OBS-007 | Formato de erro inconsistente entre rotas | bug | Média | manual |
| OBS-004 | Busca com espaços: tela ≠ API | bug | Baixa/Média | `catalog.spec` › espaços ao redor |
| OBS-008 | `brandsList` com marcas repetidas | bug | Baixa | manual |
| OBS-010 | JSON servido como `text/html` | melhoria | Baixa | manual |

---
## OBS-001: API responde HTTP 200 mesmo quando o corpo informa erro
- **Tipo:** bug · **Severidade:** Média
- **Passos:** `POST /api/productsList` · `PUT /api/brandsList` · `GET /api/searchProduct` · `GET|DELETE /api/verifyLogin` · `POST /api/getUserDetailByEmail` · `POST /api/searchProduct` sem `search_product`
- **Esperado:** HTTP 405 para método não suportado e HTTP 400 para parâmetro ausente, iguais ao `responseCode` do corpo.
- **Obtido:** HTTP **200**, com estes corpos:
  - `{"responseCode": 405, "message": "This request method is not supported."}`
  - `{"responseCode": 400, "message": "Bad request, search_product parameter is missing in POST request."}`
- **Impacto:** clientes, gateways, monitoramento e retries confiam no HTTP, então um erro passa como sucesso.
- **Sugestão:** devolver o status HTTP correto e manter o `responseCode` coerente com ele.
- **Evidência:** `api-respostas.json` (chaves OBS-001) e os testes `status HTTP deve ser 405` e `status HTTP igual ao código do corpo`.

## OBS-002: carrinho aceita quantidade 0
- **Tipo:** bug · **Severidade:** Média
- **Passos:** abrir `/product_details/{id}` > quantidade `0` > Add to cart > View Cart.
- **Esperado:** recusar a quantidade (mínimo 1).
- **Obtido:** aparece o modal de sucesso, e o carrinho ganha uma linha com quantidade **0** e total **Rs. 0**.
- **Impacto:** item "fantasma" no carrinho, que segue para o checkout.
- **Sugestão:** validar `quantity >= 1` no servidor (`/add_to_cart/{id}?quantity=`).
- **Evidência:** mesmo comportamento da OBS-003 com quantidade 0 (verificado na exploração; ver o print da OBS-003 para o fluxo).

## OBS-003: carrinho aceita quantidade negativa e gera total negativo
- **Tipo:** bug · **Severidade:** Alta
- **Passos:** os mesmos da OBS-002, com quantidade `-1`. A tela dispara `GET /add_to_cart/3?quantity=-1`, e o servidor aceita.
- **Esperado:** recusar a quantidade.
- **Obtido:** linha com quantidade **-1** e total **Rs. -1000** (produto de Rs. 1000).
- **Impacto:** manipulação do total (desconto indevido ou crédito), um risco financeiro direto. Como a regra falta no servidor, basta chamar a URL, sem passar pela tela.
- **Sugestão:** validar no servidor (inteiro >= 1). O `min` do HTML não protege.
- **Evidência:** ![OBS-003](evidencias/OBS-003-total-negativo.png)

## OBS-004: busca com espaços ao redor dá resultados diferentes na tela e na API
- **Tipo:** bug · **Severidade:** Baixa/Média
- **Passos:** buscar `" top "` na tela e em `POST /api/searchProduct`.
- **Esperado:** o mesmo conjunto de produtos nos dois canais (idealmente com `trim`).
- **Obtido:** a tela devolve **12** produtos e a API **7**. Sem os espaços, as duas devolvem 14. A tela manda `?search=%20top`, ou seja, corta só o espaço final.
- **Impacto:** a mesma busca dá resultados diferentes conforme o canal.
- **Sugestão:** normalizar o termo (trim) em um único lugar, usado pela tela e pela API.
- **Evidência:** ![OBS-004](evidencias/OBS-004-busca-espacos-tela.png) e o teste `busca com espaços ao redor`.

## OBS-005: sem limite máximo de quantidade
- **Tipo:** regra que falta / risco · **Severidade:** Média
- **Passos:** adicionar um produto de Rs. 400 com quantidade `999999`.
- **Esperado:** depende da regra do PO (estoque ou teto por pedido; ver a pergunta 1 em PLANEJAMENTO).
- **Obtido:** a quantidade é aceita e o total vira **Rs. 399999600**.
- **Impacto:** pedidos absurdos, abuso e nenhuma noção de estoque.
- **Sugestão:** definir um teto e validar no servidor.
- **Evidência:** verificado manualmente na exploração. Não foi automatizado, porque o resultado esperado depende da resposta do PO.

## OBS-007: rotas devolvem erros em formatos diferentes
- **Tipo:** bug (contrato) · **Severidade:** Média
- **Passos:** `GET /api/createAccount`, `PATCH /api/updateAccount`.
- **Esperado:** o mesmo envelope das outras rotas, `{responseCode, message}`.
- **Obtido:** HTTP **405** (correto) com corpo `{"detail": "Method \"GET\" not allowed."}`, sem `responseCode`. As demais rotas devolvem HTTP 200 + `responseCode` (OBS-001).
- **Impacto:** o consumidor precisa tratar dois formatos de erro, e um cliente que lê só `responseCode` recebe `undefined`.
- **Sugestão:** padronizar o tratamento de erro (um handler único).
- **Evidência:** `api-respostas.json` (chaves OBS-007).

## OBS-008: `brandsList` devolve marcas repetidas
- **Tipo:** bug · **Severidade:** Baixa
- **Passos:** `GET /api/brandsList`.
- **Esperado:** cada marca uma única vez, com ID próprio.
- **Obtido:** **34** registros e só **8** marcas distintas (ex.: `Polo` com id 1 e id 8). Parece uma entrada por produto.
- **Impacto:** filtros por marca podem aparecer duplicados, e o ID da marca deixa de ser uma chave confiável.
- **Sugestão:** devolver marcas distintas (ou renomear a rota, se a intenção for "marca por produto").
- **Evidência:** `api-respostas.json` (chave OBS-008).

## OBS-009: `getUserDetailByEmail` expõe dado pessoal sem autenticação
- **Tipo:** risco (privacidade/LGPD) · **Severidade:** Alta
- **Passos:** `GET /api/getUserDetailByEmail?email=<e-mail de uma conta>`, sem token nem senha.
- **Esperado (premissa, pergunta 6 ao PO):** exigir autenticação e/ou devolver só o mínimo.
- **Obtido:** nome, data de nascimento, empresa, endereço completo, cidade, estado e CEP de qualquer e-mail informado. A senha **não** é exposta (teste próprio).
- **Impacto:** qualquer pessoa que tenha um e-mail obtém o endereço do titular. Exposição de dado pessoal e possível enumeração de contas.
- **Sugestão:** exigir autenticação e limitar os campos devolvidos.
- **Evidência:** `api-respostas.json` (chave OBS-009, com uma conta `QA_` fictícia, já apagada).

## OBS-010: JSON servido com `content-type: text/html`
- **Tipo:** melhoria · **Severidade:** Baixa
- **Passos:** qualquer rota da API, por exemplo `GET /api/productsList`.
- **Esperado:** `application/json`.
- **Obtido:** `text/html; charset=utf-8` (só as respostas da OBS-007 vêm como JSON).
- **Impacto:** clientes HTTP não fazem o parse automático, e há risco de o navegador interpretar o conteúdo como HTML.
- **Sugestão:** definir o content-type correto.
- **Evidência:** `api-respostas.json` (chave OBS-010).

## OBS-011: pedido confirmado e fatura gerada sem pagamento, com o valor vindo da URL
- **Tipo:** bug (segurança/financeiro) · **Severidade:** Alta
- **Passos:** entrar com uma conta, deixar o carrinho vazio e abrir `/payment_done/1`; depois, `/download_invoice/1`.
- **Esperado:** a confirmação e a fatura só existem para um pedido pago, e o valor vem do pedido gravado no servidor, nunca da URL.
- **Obtido:**
  - a tela mostra **"ORDER PLACED! Congratulations! Your order has been confirmed!"**;
  - a fatura diz **"Your total purchase amount is 1"**;
  - no fluxo normal, a URL final carrega o valor do pedido (`/payment_done/500` para um produto de Rs. 500).
- **Impacto:** qualquer cliente gera uma confirmação ou fatura com qualquer valor, sem pagar. Isso abre espaço para fraude, contestação e comprovante falso.
- **Sugestão:** gerar a confirmação e a fatura a partir do ID do pedido gravado (com dono e status "pago") e validar no servidor.
- **Evidência:** ![OBS-011](evidencias/OBS-011-payment-done-sem-pagamento.png) e [`OBS-011-fatura-sem-pagamento.txt`](evidencias/OBS-011-fatura-sem-pagamento.txt).
- **Achado relacionado:** a mensagem "Your order has been placed successfully!", usada pelo Test Case 14 do site, já está no HTML antes do pagamento (elemento oculto). Por isso ela não serve como prova de que o pedido foi processado.

---
## Itens verificados que não são defeito
- **Quantidade decimal (1.5) ou texto:** o campo é `type=number`, e o navegador bloqueia texto. Não foi testada a chamada direta `?quantity=1.5`; está listada como cenário manual.
- **Métodos errados em `createAccount`/`updateAccount`:** o HTTP 405 está correto, e o problema está só no formato do corpo (OBS-007).
- **`getUserDetailByEmail` não devolve a senha:** coberto por teste, que passa.
