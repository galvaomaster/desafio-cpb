# language: pt
# Frente 4 - Compra de ponta a ponta: cria a conta pela API, entra pela tela, compra e confere o resultado.
# Técnica: fluxo de caso de uso.
# Automação: tests/ui/purchase.spec.ts

@frente-4
Funcionalidade: Frente 4 - Compra de ponta a ponta

  @automatizado @smoke
  Cenário: Conta criada pela API compra pela tela
    Dado uma conta criada pela API
    Quando entro na tela com essa conta
    Então vejo "Logged in as" com o nome da conta
    Quando adiciono 2 unidades de um produto e sigo para o checkout
    Então o endereço de entrega é o cadastrado pela API
    E o total do pedido é o preço da API vezes 2
    Quando pago com um cartão fictício
    Então vejo "Congratulations! Your order has been confirmed!"
    E o carrinho fica vazio

  # Fora da automação para não gerar comprovantes falsos no ambiente compartilhado.
  @manual @OBS-011
  Cenário: Confirmação e fatura só existem para pedido pago
    Dado que estou logado e com o carrinho vazio
    Quando abro direto a página de confirmação e a fatura de um pedido
    Então o sistema não confirma pedido nem gera fatura

  # Depende da resposta do PO (P02).
  @manual
  Cenário: Visitante precisa entrar para finalizar a compra
    Dado que tenho produtos no carrinho sem estar logado
    Quando sigo para o checkout
    Então o sistema pede login ou cadastro
