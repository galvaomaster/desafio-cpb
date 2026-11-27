# language: pt
# Frente 3 - API de conta: ciclo de vida da conta e tratamento de dado pessoal.
# Técnicas: transição de estado e tabela de decisão.
# Automação: tests/api/account.api.spec.ts
# Toda conta usa nome QA_ e e-mail único em @example.com, e é apagada ao final.

@frente-3
Funcionalidade: Frente 3 - API de conta

  @automatizado @smoke
  Cenário: Criar, consultar, entrar, atualizar e apagar a conta
    Quando crio uma conta
    Então a API responde 201 "User created!"
    E a consulta por e-mail devolve os dados enviados
    E o login com a senha correta responde 200 "User exists!"
    Quando atualizo a cidade
    Então a consulta mostra a cidade nova
    Quando apago a conta
    Então a API responde "Account deleted!"
    E o login com a mesma senha responde 404

  @automatizado
  Cenário: Não cria duas contas com o mesmo e-mail
    Quando tento criar uma conta com um e-mail já cadastrado
    Então a API responde 400 "Email already exists!"

  @automatizado
  Cenário: Login com senha errada é recusado
    Quando entro com a senha errada
    Então a API responde 404 "User not found!"

  @automatizado
  Cenário: Consulta da conta não devolve a senha
    Quando consulto a conta pelo e-mail
    Então a resposta não contém a senha

  @automatizado @falha-esperada @OBS-009
  Cenário: Consulta sem autenticação não expõe dado pessoal
    Quando consulto a conta pelo e-mail, sem autenticação
    Então a resposta não traz endereço nem data de nascimento

  # Depende da resposta do PO (P09).
  @manual
  Cenário: Cadastro com dados inválidos é recusado
    Quando crio uma conta com e-mail mal formado ou campo obrigatório vazio
    Então a API responde 400
