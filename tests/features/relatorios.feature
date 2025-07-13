# language: pt

Funcionalidade: Gerenciamento de Relatórios
  Como um usuário do sistema
  Eu quero poder gerar e gerenciar relatórios
  Para acompanhar o progresso dos projetos

  Cenário: Gerar relatório de progresso do projeto com sucesso
    Dado que eu estou autenticado como "Gerente"
    E existe um projeto com ID "123" no sistema
    Quando eu enviar uma requisição GET para "/relatorios/projeto/123"
    Então devo receber o status 200
    E a resposta deve conter os dados do relatório
    E o relatório deve incluir as seguintes informações:
      | campo                    | tipo     |
      | nome_projeto            | texto    |
      | data_inicio             | data     |
      | progresso_total         | número   |
      | tarefas_concluidas      | número   |
      | tarefas_pendentes       | número   |

  Cenário: Tentar gerar relatório de projeto inexistente
    Dado que eu estou autenticado como "Gerente"
    Quando eu enviar uma requisição GET para "/relatorios/projeto/999"
    Então devo receber o status 404
    E devo receber uma mensagem de erro "Projeto não encontrado"

  Cenário: Gerar relatório de desempenho da equipe
    Dado que eu estou autenticado como "Gerente"
    E existe uma equipe com ID "456" no sistema
    Quando eu enviar uma requisição GET para "/relatorios/equipe/456"
    Então devo receber o status 200
    E a resposta deve conter os dados do relatório
    E o relatório deve incluir as seguintes informações:
      | campo                        | tipo     |
      | nome_equipe                 | texto    |
      | total_membros              | número   |
      | tarefas_concluidas_mes     | número   |
      | media_tempo_conclusao      | número   |
      | desempenho_geral           | texto    |

  Cenário: Tentar acessar relatório sem autorização
    Dado que eu estou autenticado como "Desenvolvedor"
    Quando eu enviar uma requisição GET para "/relatorios/equipe/456"
    Então devo receber o status 403
    E devo receber uma mensagem de erro "Acesso não autorizado" 