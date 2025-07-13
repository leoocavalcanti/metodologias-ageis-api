# language: pt

Funcionalidade: Gerenciamento de Usuários
  Como um administrador do sistema
  Eu quero poder gerenciar usuários
  Para controlar quem tem acesso ao sistema

  Cenário: Criar um novo usuário com sucesso
    Dado que eu tenho os seguintes dados do usuário:
      | nome           | papel          |
      | João da Silva  | Desenvolvedor  |
    Quando eu enviar uma requisição POST para "/usuarios"
    Então devo receber o status 201
    E o usuário deve ser criado com sucesso
    E a resposta deve conter os dados do usuário

  Cenário: Tentar criar um usuário com dados inválidos
    Dado que eu tenho dados inválidos do usuário:
      | nome | papel |
      | Jo   | Dev   |
    Quando eu enviar uma requisição POST para "/usuarios"
    Então devo receber o status 400
    E devo receber uma mensagem de erro 