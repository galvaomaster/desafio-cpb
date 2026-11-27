# Uso das referências do site

O enunciado pede para usar a [lista de APIs](https://automationexercise.com/api_list) e a [lista de casos de teste](https://automationexercise.com/test_cases) como referência, lembrando que elas não dizem o que é correto.

## O que aproveitei
- **Lista de APIs:** rotas, métodos, parâmetros e mensagens de sucesso e de erro documentadas.
- **Casos de teste TC8, TC9, TC12, TC13, TC16, TC17 e TC23:** os fluxos de tela de catálogo, busca, carrinho e compra.

## Onde elas não bastam
- **Nenhum caso compara a tela com a API.** Esse é o centro da frente 2.
- **Os casos só checam se algo aparece na tela**, sem dizer qual valor é o correto. Aqui o valor esperado vem da API.
- **O TC13 testa só a quantidade 4.** Não testa 0, negativo nem limite (OBS-002, OBS-003).
- **Não há casos de API** na página de casos de teste. Também não há nada sobre dado pessoal (OBS-009).
- **Alguns erros não estão documentados** na lista de APIs: e-mail duplicado e consulta de e-mail inexistente.

## Onde elas divergem do sistema
| Referência | O que diz | O que o sistema faz |
|---|---|---|
| Lista de APIs, "Response Code" | 400, 404, 405 | o código vem no corpo; o HTTP é 200 (OBS-001) |
| Lista de APIs, API 3 | "All brands list" | 34 registros, só 8 marcas distintas (OBS-008) |
| TC14 a TC16 | conferir "Your order has been placed successfully!" | essa mensagem já está escondida no HTML antes do pagamento, então não prova nada. O E2E confere a página final |
| TC24 | baixar a fatura depois da compra | a fatura sai sem compra, com o valor vindo da URL (OBS-011) |
