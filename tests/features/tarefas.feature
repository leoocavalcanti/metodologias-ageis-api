# language: pt

Funcionalidade: Gerenciamento de Tarefas
  Como um membro da equipe
  Eu quero poder gerenciar tarefas
  Para organizar e acompanhar o trabalho da equipe

  Cenário: Criar uma nova tarefa com sucesso
    Dado que eu estou autenticado como "Desenvolvedor"
    E eu tenho os seguintes dados da tarefa:
      | titulo           | descricao                    | prioridade | estimativa |
      | Implementar API  | Criar endpoints REST da API  | Alta       | 8          |
    Quando eu enviar uma requisição POST para "/tarefas"
    Então devo receber o status 201
    E a tarefa deve ser criada com sucesso
    E a resposta deve conter os dados da tarefa

  Cenário: Atualizar o status de uma tarefa
    Dado que eu estou autenticado como "Desenvolvedor"
    E existe uma tarefa com ID "789" no sistema
    E eu tenho o seguinte status para atualização:
      | status           |
      | Em Andamento    |
    Quando eu enviar uma requisição PATCH para "/tarefas/789"
    Então devo receber o status 200
    E o status da tarefa deve ser atualizado
    E devo receber os dados atualizados da tarefa

  Cenário: Atribuir tarefa a um membro da equipe
    Dado que eu estou autenticado como "Gerente"
    E existe uma tarefa com ID "789" no sistema
    E existe um usuário com ID "456" no sistema
    E eu tenho o seguinte usuário para atribuição:
      | usuario_id |
      | 456        |
    Quando eu enviar uma requisição PATCH para "/tarefas/789/atribuir"
    Então devo receber o status 200
    E a tarefa deve ser atribuída ao usuário
    E devo receber uma confirmação da atribuição

  Cenário: Listar tarefas com filtros
    Dado que eu estou autenticado como "Desenvolvedor"
    E eu tenho os seguintes filtros de busca:
      | status        | prioridade |
      | Em Andamento | Alta       |
    Quando eu enviar uma requisição GET para "/tarefas"
    Então devo receber o status 200
    E devo receber uma lista de tarefas
    E todas as tarefas devem ter status "Em Andamento"
    E todas as tarefas devem ter prioridade "Alta"

  Cenário: Tentar criar uma tarefa com dados inválidos
    Dado que eu estou autenticado como "Desenvolvedor"
    E eu tenho dados inválidos da tarefa:
      | titulo | descricao | prioridade | estimativa |
      |        | Test      | Baixa      | -1         |
    Quando eu enviar uma requisição POST para "/tarefas"
    Então devo receber o status 400
    E devo receber mensagens de validação apropriadas 