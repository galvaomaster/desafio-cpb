# language: pt
# Frente 2 - Catálogo e busca (parte API): garante que a API, usada como oráculo da tela, está correta.
# Técnicas: validação de estrutura, partição de equivalência e status HTTP x corpo.
# Automação: tests/api/catalog.api.spec.ts

@frente-2
Funcionalidade: Frente 2 - Catálogo e busca: API

  @automatizado @smoke
  Cenário: Lista de produtos tem a estrutura esperada
    Quando chamo GET /api/productsList
    Então o status e o responseCode são 200
    E cada produto tem id, nome, preço "Rs. <número>", marca e categoria

  @automatizado
  Esquema do Cenário: Busca encontra o produto de origem
    Quando chamo POST /api/searchProduct com um termo do tipo <tipo>
    Então o produto de origem está no resultado

    Exemplos:
      | tipo             |
      | nome completo    |
      | minúsculas       |
      | primeira palavra |

  @automatizado
  Cenário: Busca sem o parâmetro obrigatório
    Quando chamo POST /api/searchProduct sem search_product
    Então o corpo informa responseCode 400 e a mensagem de parâmetro ausente

  @automatizado @falha-esperada @OBS-001
  Cenário: Status HTTP igual ao código do corpo na busca sem parâmetro
    Quando chamo POST /api/searchProduct sem search_product
    Então o status HTTP é 400

  @manual @OBS-008
  Cenário: Lista de marcas não repete marcas
    Quando chamo GET /api/brandsList
    Então cada marca aparece uma única vez
