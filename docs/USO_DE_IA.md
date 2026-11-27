# Uso de IA

**QA responsável:** Anderson Galvão

Este documento responde à seção 7 do enunciado do Desafio Prático de QA do CPB.

**Sim, usei IA neste desafio.** Ela acelerou a exploração, o código e a documentação. As decisões sobre riscos e premissas e o que conta como bug foram validados por mim, rodando os testes contra o site.

## 1. Ferramentas e etapas

| Etapa | Ferramenta |
|---|---|
| Planejamento (riscos, perguntas ao PO, premissas) | Claude Code no VS Code; revisei e reordenei o rascunho |
| Exploração do site e coleta de evidências | Playwright MCP: navegação, requisições de rede e prints |
| Código (Page Objects, fixtures, testes) | Claude Code, com execução e correção a cada passo |
| Documentação | Claude Code, com revisão minha |

## 2. Skill, agente ou instrução própria

Não criei skill nem agente. Usei o **Playwright MCP**, que dá à IA um navegador para abrir páginas, clicar, ler as requisições e tirar prints.

Dei instruções no próprio prompt:
- seguir as regras do ambiente (`QA_`, `@example.com`, apagar as contas criadas);
- não escrever ID nem preço fixo nos testes;
- **só registrar como bug o que foi reproduzido e tem evidência**.

## 3. O que a IA errou e como corrigi

1. **Cálculo do preço.** A função que lê o preço transformava `"Rs. 500"` em 0,5. Percebi ao rodar os testes: os totais do carrinho davam errado por um fator de 1000. Corrigi removendo o `Rs.` antes de converter.
2. **Formato de erro da API.** A IA supôs que todas as rotas respondem `{responseCode, message}`. Duas rotas de conta respondem `{"detail": ...}`. Em vez de ajustar o teste para passar, investiguei e registrei o achado como **OBS-007**.
3. **Lista de marcas.** O teste supunha que `brandsList` não repete marcas, mas vieram 34 registros com só 8 marcas. Registrei como **OBS-008**.
4. **Falso positivo.** O teste de quantidade negativa esperava a mensagem de sucesso. Se o fornecedor corrigisse o bug, o teste continuaria passando. Ajustei para conferir o carrinho, e não a mensagem.
5. **Projeto elaborado demais.** A IA tendeu a complicar o projeto (bibliotecas extras, testes unitários, muitas camadas e documentos longos). Simplifiquei para o que o enunciado pede.

## 4. O que revisei antes de entregar

- Rodei a suíte completa contra o site real.
- Conferi que cada falha esperada falha pelo motivo do bug, e não por seletor ou tempo de espera.
- Reproduzi cada observação manualmente antes de documentar.
- Revisei as severidades e a ordem dos riscos com o meu critério: dinheiro e dado pessoal primeiro.
- Confirmei que não há credencial no repositório e que as contas de teste são apagadas.
