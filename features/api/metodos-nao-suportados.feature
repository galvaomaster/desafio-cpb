# language: pt
# Frente 3 - API: métodos que a API não deveria aceitar e status HTTP x corpo.
# A regra vale para a API inteira, então as rotas incluem o login e o catálogo.
# Automação: tests/api/methods.api.spec.ts

@frente-3
Funcionalidade: Frente 3 - API: métodos não suportados

  @automatizado
  Esquema do Cenário: Corpo informa que o método não é suportado
    Quando chamo <método> <rota>
    Então o corpo informa responseCode 405 e "This request method is not supported."

    Exemplos:
      | método | rota              |
      | POST   | /api/productsList |
      | PUT    | /api/brandsList   |
      | DELETE | /api/verifyLogin  |

  @automatizado @falha-esperada @OBS-001
  Esquema do Cenário: Status HTTP do método não suportado é 405
    Quando chamo <método> <rota>
    Então o status HTTP é 405

    Exemplos:
      | método | rota              |
      | POST   | /api/productsList |
      | PUT    | /api/brandsList   |
      | DELETE | /api/verifyLogin  |

  @manual @OBS-007
  Cenário: Rotas de conta seguem o mesmo formato de erro
    Quando chamo GET /api/createAccount ou PATCH /api/updateAccount
    Então o corpo tem responseCode e message, como as demais rotas
