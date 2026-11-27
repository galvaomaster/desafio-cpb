# language: pt
# Frente 1 - Carrinho de visitante: quantidade, total e remoção de itens, sem login.
# Técnicas: partição de equivalência, valor limite e transição de estado.
# Automação: tests/ui/cart.spec.ts

@frente-1
Funcionalidade: Frente 1 - Carrinho de visitante

  Contexto:
    Dado que estou sem login, com o carrinho vazio
    E que os produtos e preços foram obtidos da API

  @automatizado @smoke
  Cenário: Produto adicionado aparece com os dados da API
    Quando adiciono 1 unidade de um produto ao carrinho
    Então o carrinho mostra o nome e o preço do produto na API
    E a quantidade é 1 e o total é igual ao preço

  @automatizado
  Esquema do Cenário: Total é o preço vezes a quantidade
    Quando adiciono <quantidade> unidades de um produto ao carrinho
    Então o total da linha é o preço da API vezes <quantidade>

    Exemplos:
      | quantidade |
      | 1          |
      | 2          |
      | 5          |

  @automatizado @falha-esperada @OBS-003
  Cenário: Quantidade negativa não entra no carrinho
    Quando adiciono um produto com quantidade -1
    Então o produto não aparece no carrinho

  @manual @OBS-002
  Cenário: Quantidade zero não entra no carrinho
    Quando adiciono um produto com quantidade 0
    Então o produto não aparece no carrinho

  # Depende da resposta do PO (P01).
  @manual @OBS-005
  Cenário: Quantidade acima do limite é recusada
    Quando adiciono um produto com quantidade 999999
    Então o sistema recusa ou limita a quantidade

  @manual
  Cenário: Mesmo produto adicionado duas vezes soma na mesma linha
    Quando adiciono 2 unidades de um produto e depois mais 3
    Então o carrinho tem uma única linha desse produto, com quantidade 5

  @automatizado @smoke
  Cenário: Remover o único item deixa o carrinho vazio
    Dado que tenho 1 produto no carrinho
    Quando removo esse produto
    Então o carrinho mostra a mensagem de carrinho vazio

  @automatizado
  Cenário: Remover um item mantém os outros
    Dado que tenho o produto A com 1 unidade e o produto B com 2 unidades
    Quando removo o produto A
    Então só o produto B continua no carrinho, com 2 unidades
