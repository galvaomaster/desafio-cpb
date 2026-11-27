# language: pt
# Frente 2 - Catálogo e busca: a tela e a API devem contar a mesma história (parte tela x API).
# Técnicas: comparação tela x API (a API é o oráculo) e partição de equivalência nos termos de busca.
# Automação: tests/ui/catalog.spec.ts

@frente-2
Funcionalidade: Frente 2 - Catálogo e busca: tela x API

  @automatizado @smoke
  Cenário: Lista de produtos da tela é igual à da API
    Quando abro a tela de produtos
    Então a tela mostra os mesmos produtos da API, com o mesmo id, nome e preço

  @automatizado
  Cenário: Detalhe do produto mostra o nome e o preço da API
    Quando abro o detalhe de um produto
    Então a tela mostra o mesmo nome e o mesmo preço da API

  @automatizado
  Esquema do Cenário: Busca na tela e na API trazem os mesmos produtos
    Quando busco um termo do tipo <tipo> na tela e na API
    Então as duas devolvem os mesmos produtos

    Exemplos:
      | tipo             |
      | nome completo    |
      | minúsculas       |
      | primeira palavra |

  @automatizado
  Cenário: Busca sem resultado é vazia na tela e na API
    Quando busco um termo que não existe
    Então a tela e a API não devolvem nenhum produto

  @automatizado @falha-esperada @OBS-004
  Cenário: Busca com espaços ao redor do termo
    Quando busco um termo com espaço antes e depois, na tela e na API
    Então as duas devolvem os mesmos produtos

  # Depende da resposta do PO (P04).
  @manual
  Cenário: Busca com acentos e caracteres especiais
    Quando busco termos com acento, aspas ou "<script>"
    Então a tela e a API tratam o termo da mesma forma, sem erro
