# language: pt

Funcionalidade: Gerenciamento de Projetos
  Como um gerente
  Eu quero poder gerenciar projetos
  Para organizar e acompanhar o trabalho das equipes

  Cenário: Criar um novo projeto com sucesso
    Dado que eu estou autenticado como "Gerente"
    E eu tenho os seguintes dados do projeto:
      | nome                    | descricao                         | data_inicio  | data_fim     |
      | Sistema de Vendas      | Sistema para gestão de vendas     | 2024-03-01   | 2024-12-31   |
    Quando eu enviar uma requisição POST para "/projetos"
    Então devo receber o status 201
    E o projeto deve ser criado com sucesso
    E a resposta deve conter os dados do projeto

  Cenário: Adicionar membros a um projeto
    Dado que eu estou autenticado como "Gerente"
    E existe um projeto com ID "123" no sistema
    E existem os seguintes usuários no sistema:
      | id  | nome           | papel          |
      | 456 | João Silva    | Desenvolvedor  |
      | 789 | Maria Santos  | Designer       |
    E eu tenho os seguintes IDs de usuários para adicionar:
      | usuarios  |
      | 456, 789  |
    Quando eu enviar uma requisição POST para "/projetos/123/membros"
    Então devo receber o status 200
    E os membros devem ser adicionados ao projeto
    E devo receber uma confirmação da adição

  Cenário: Atualizar status do projeto
    Dado que eu estou autenticado como "Gerente"
    E existe um projeto com ID "123" no sistema
    E eu tenho o seguinte status para atualização:
      | status           |
      | Em Andamento    |
    Quando eu enviar uma requisição PATCH para "/projetos/123"
    Então devo receber o status 200
    E o status do projeto deve ser atualizado
    E devo receber os dados atualizados do projeto

  Cenário: Listar projetos com filtros
    Dado que eu estou autenticado como "Gerente"
    E eu tenho os seguintes filtros de busca:
      | status        | data_inicio_apos |
      | Em Andamento | 2024-01-01       |
    Quando eu enviar uma requisição GET para "/projetos"
    Então devo receber o status 200
    E devo receber uma lista de projetos
    E todos os projetos devem ter status "Em Andamento"
    E todos os projetos devem ter data de início após "2024-01-01"

  Cenário: Tentar criar um projeto com datas inválidas
    Dado que eu estou autenticado como "Gerente"
    E eu tenho dados inválidos do projeto:
      | nome           | descricao      | data_inicio  | data_fim     |
      | Novo Projeto  | Descrição      | 2024-12-31   | 2024-01-01   |
    Quando eu enviar uma requisição POST para "/projetos"
    Então devo receber o status 400
    E devo receber uma mensagem de erro "Data de fim não pode ser anterior à data de início" 