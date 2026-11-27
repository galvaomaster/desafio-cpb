# Planejamento e dúvidas de negócio

**QA responsável:** Anderson Galvão

Este documento planeja a avaliação do módulo de loja virtual que um fornecedor vai entregar ao CPB (Desafio Prático de QA). Ele responde à seção 1 do enunciado.

## Riscos por frente, em ordem de prioridade

**Critério:** primeiro o impacto em dinheiro e em dado pessoal; depois a chance de acontecer em produção.

1. **Carrinho de visitante.** Mexe com dinheiro, e toda compra passa por ele. O carrinho aceita quantidade 0 e negativa, o que gera total negativo (OBS-002, OBS-003).
2. **API de conta.** Guarda dado pessoal. A consulta por e-mail devolve endereço e nascimento sem autenticação (OBS-009), e a API responde HTTP 200 mesmo com erro (OBS-001).
3. **Compra de ponta a ponta.** Junta as outras frentes. A confirmação e a fatura saem sem pagamento (OBS-011).
4. **Catálogo e busca.** O impacto é menor, porque não perde dinheiro direto, mas a tela e a API divergem (OBS-004).

## Perguntas ao PO

| # | Pergunta | Premissa adotada até a resposta | Como a resposta muda o teste |
|---|---|---|---|
| P01 | Qual a quantidade mínima e máxima por item? Existe estoque? | mínimo 1, sem teto | com um teto N, entram os testes de N e N+1 (valor limite) |
| P02 | Visitante pode finalizar a compra sem cadastro? | não, precisa entrar | se puder, a compra de visitante vira um cenário automatizado |
| P03 | Adicionar o mesmo produto de novo soma ou substitui a quantidade? | soma | se substituir, o resultado esperado se inverte |
| P04 | A busca deve ignorar maiúsculas, acentos e espaços nas pontas? | ignora maiúsculas e espaços | entram termos com e sem acento como casos de teste |
| P05 | A tela e a API usam a mesma regra de busca? | sim | se não, a OBS-004 deixa de ser bug |
| P06 | A consulta por e-mail deve exigir autenticação? | sim | se for pública por decisão, a OBS-009 vira risco aceito |
| P07 | O status HTTP deve ser igual ao código do corpo? | sim | se não, saem os testes de status HTTP (OBS-001) |
| P08 | O que acontece com os pedidos quando a conta é apagada? | não verificado | entra um teste depois da exclusão (pedido anonimizado?) |
| P09 | Quais campos do cadastro são obrigatórios? Qual a política de senha? | os da lista de APIs são obrigatórios | vira uma tabela de decisão do cadastro |
| P10 | Existe frete, imposto ou desconto no total? | não | o total esperado passa a incluir esses valores |
| P11 | O que prova que um pedido foi pago? Existe histórico de pedidos? | só pedido pago gera confirmação | o E2E passa a conferir o pedido no histórico |
| P12 | `brandsList` deve listar marcas distintas ou uma por produto? | distintas | se for uma por produto, a OBS-008 deixa de ser bug |

## Premissas adotadas

Onde faltou regra:
- A quantidade válida é um inteiro maior ou igual a 1.
- O total é preço × quantidade, sem frete.
- O mesmo produto adicionado de novo soma na mesma linha.
- A busca não diferencia maiúsculas de minúsculas e ignora espaços nas pontas.
- O status HTTP deve ser igual ao código do corpo.
- Apagar a conta é definitivo: depois, o login falha.

O comportamento esperado completo está em [requisitos/requisitos.md](../requisitos/requisitos.md).
