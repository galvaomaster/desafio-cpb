# Requisitos por frente

São **requisitos propostos por mim** (não validados pelo negócio). Quando o PO responder uma dúvida (P01, P02…), o requisito e o teste mudam juntos.

**Situação de hoje:**
- ✅ atende;
- ❌ não atende (a observação está indicada);
- ⏳ aguarda o PO.

## Frente 1: Carrinho de visitante

| ID | Comportamento esperado | Por quê | Hoje |
|---|---|---|---|
| RQ-1.1 | O item no carrinho tem o mesmo nome e preço da API | o preço visto no carrinho é o que o cliente aceita pagar | ✅ |
| RQ-1.2 | Total da linha = preço × quantidade (sem frete) | é a única conta exibida no fluxo (P10) | ✅ |
| RQ-1.3 | Quantidade só inteira e ≥ 1, validada no servidor | 0 cria item fantasma, e negativo gera total negativo | ❌ OBS-002, OBS-003 |
| RQ-1.4 | O mesmo produto adicionado de novo soma na mesma linha | padrão de lojas virtuais (P03) | ✅ |
| RQ-1.5 | Remover tira só aquele item; sem itens, mostra o carrinho vazio | é como o cliente corrige o pedido | ✅ |
| RQ-1.6 | Existe um limite máximo de quantidade | hoje 999999 é aceito | ⏳ P01 (OBS-005) |

## Frente 2: Catálogo e busca

| ID | Comportamento esperado | Por quê | Hoje |
|---|---|---|---|
| RQ-2.1 | A lista e o detalhe da tela mostram o mesmo id, nome e preço da API | outro canal não pode mostrar um preço diferente | ✅ |
| RQ-2.2 | A busca é por parte do nome, sem diferenciar maiúsculas; sem resultado devolve lista vazia | o cliente digita do jeito que lembra | ✅ |
| RQ-2.3 | A mesma busca dá o mesmo resultado na tela e na API, ignorando espaços nas pontas | um espaço digitado sem querer não pode mudar o resultado | ❌ OBS-004 |
| RQ-2.4 | `productsList` tem id, nome, preço `Rs. <número>`, marca e categoria | a lista de APIs não define os campos, e quem consome depende deles | ✅ |
| RQ-2.5 | `brandsList` não repete marcas | uma lista "de marcas" com repetição quebra os filtros | ❌ OBS-008 |

## Frente 3: API de conta

| ID | Comportamento esperado | Por quê | Hoje |
|---|---|---|---|
| RQ-3.1 | Criar, consultar, entrar, atualizar e apagar funcionam; depois de apagar, o login responde 404 | é o ciclo de vida publicado na lista de APIs | ✅ |
| RQ-3.2 | O e-mail é único: um duplicado responde 400 | o e-mail é o login e a chave de consulta | ✅ |
| RQ-3.3 | Senha errada e e-mail inexistente dão a mesma resposta (404) | não revela quais e-mails têm conta | ✅ |
| RQ-3.4 | A senha nunca é devolvida | devolver a senha permite tomar a conta | ✅ |
| RQ-3.5 | Consultar endereço e nascimento exige autenticação | hoje qualquer pessoa com o e-mail obtém esses dados (LGPD) | ❌ OBS-009 (P06) |
| RQ-3.6 | O cadastro recusa e-mail mal formado e campo obrigatório vazio | dado inválido vira problema na entrega | ⏳ P09 |

## Frente 4: Compra de ponta a ponta

| ID | Comportamento esperado | Por quê | Hoje |
|---|---|---|---|
| RQ-4.1 | A conta criada pela API entra pela tela | a tela e a API usam a mesma base de clientes | ✅ |
| RQ-4.2 | O checkout mostra o endereço cadastrado e o mesmo total do carrinho | endereço ou valor errado é prejuízo direto | ✅ |
| RQ-4.3 | O pagamento confirma o pedido e esvazia o carrinho | o cliente precisa saber que a compra deu certo | ✅ |
| RQ-4.4 | A confirmação e a fatura só existem para pedido pago, com o valor vindo do servidor | hoje abrir `/payment_done/1` confirma um pedido sem pagamento | ❌ OBS-011 |
| RQ-4.5 | O visitante precisa entrar para finalizar a compra | o pedido precisa de responsável e endereço | ⏳ P02 |

## Regras para toda a API

| ID | Comportamento esperado | Por quê | Hoje |
|---|---|---|---|
| RQ-5.1 | O status HTTP é igual ao `responseCode` do corpo | monitoramento e clientes olham o status (P07) | ❌ OBS-001 |
| RQ-5.2 | Um formato de erro único `{responseCode, message}` e content-type JSON | cada rota não pode responder de um jeito | ❌ OBS-007, OBS-010 |
| RQ-5.3 | Método não suportado é recusado com 405 | é o que a lista de APIs documenta | ✅ |
