# language: pt

Funcionalidade: Gerenciamento de Sprints
  Como um Scrum Master
  Eu quero poder gerenciar as sprints do projeto
  Para acompanhar o progresso do time

  Cenário: Listar todas as sprints
    Dado que eu estou autenticado como "Scrum Master"
    Quando eu enviar uma requisição GET para "/sprints"
    Então devo receber o status 200
    E devo receber uma lista de sprints 