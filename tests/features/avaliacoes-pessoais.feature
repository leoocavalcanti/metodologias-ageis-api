# language: pt

Funcionalidade: Gerenciamento de Avaliações Pessoais
  Como um membro da equipe
  Eu quero poder registrar minhas avaliações da sprint
  Para contribuir com a melhoria contínua do time

  Cenário: Tentar criar uma avaliação com notas inválidas
    Dado que eu estou autenticado como "Desenvolvedor"
    E existe uma sprint com ID "123" no sistema
    E eu tenho dados inválidos da avaliação pessoal:
      | produtividade | climaEquipe | comunicacao | objetivosClaros | teveBloqueios |
      | 6 | 0 | 4 | 7 | 2 |
    Quando eu enviar uma requisição POST para "/avaliacoes-pessoais"
    Então devo receber o status 400
    E devo receber mensagens de validação apropriadas para avaliação pessoal

  Cenário: Listar avaliações pessoais por sprint
    Dado que eu estou autenticado como "Desenvolvedor"
    E existe uma sprint com ID "123" no sistema
    Quando eu enviar uma requisição GET para "/avaliacoes-pessoais?sprint=123"
    Então devo receber o status 200
    E devo receber uma lista de avaliações da sprint 