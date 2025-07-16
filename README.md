# API de Retrospectivas

## Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd metodologias-ageis-api
```

2. Como inciar o projeto

```bash
docker compose up --build
```

Isso irá configurar todo o ambiente, incluindo:

Endpoints Principais
1. Criar Retrospectiva do Scrum Master
POST /retrospectives/scrum-master

Exemplo de Request:

```bash
{
  "nome": "João Silva",
  "papel": "Scrum Master",
  "sprintNumber": 5,
  "startDate": "2023-01-01",
  "endDate": "2023-01-14",
  "onTime": "sim",
  "plannedPoints": 30,
  "deliveredPoints": 28,
  "totalTasks": 15,
  "completedTasks": 14,
  "pendingTasks": 1,
  "bugsFound": 3,
  "bugsResolved": 2,
  "delivery": "sim",
  "observations": "Sprint bem sucedida",
  "impediments": "Problemas com ambiente",
  "improvements": "Melhorar comunicação"
}
```

2. Criar Retrospectiva de Membro
POST /retrospectives/team-member

Exemplo de Request:
```bash
{
  "name": "Maria Souza",
  "role": "developer",
  "sprintNumber": 5,
  "productivity": 4,
  "teamClimate": 5,
  "communication": 3,
  "objectives": 4,
  "blockers": 2,
  "whatWorked": "Daily eficaz",
  "whatDidntWork": "Tarefas mal definidas",
  "suggestions": "Melhorar definição de pronto"
}
```

Consultar Estatísticas
1. Estatísticas do Scrum Master
GET /retrospectives/scrum-master-stats


Resposta
```bash
{
  "success": true,
  "data": {
    "bySprint": [
      {
        "sprintNumber": 1,
        "scrumMaster": "João Silva",
        "velocity": 28,
        "efficiency": 93.33333333333333,
        "completionRate": 93.33333333333333,
        "bugResolutionRate": 66.66666666666666,
        "startDate": "2023-01-01T00:00:00.000Z",
        "endDate": "2023-01-14T00:00:00.000Z"
      },
      {
        "sprintNumber": 5,
        "scrumMaster": "João Silva",
        "velocity": 28,
        "efficiency": 93.33333333333333,
        "completionRate": 93.33333333333333,
        "bugResolutionRate": 66.66666666666666,
        "startDate": "2023-01-01T00:00:00.000Z",
        "endDate": "2023-01-14T00:00:00.000Z"
      },
      {
        "sprintNumber": 5,
        "scrumMaster": "João Silva",
        "velocity": 28,
        "efficiency": 93.33333333333333,
        "completionRate": 93.33333333333333,
        "bugResolutionRate": 66.66666666666666,
        "startDate": "2023-01-01T00:00:00.000Z",
        "endDate": "2023-01-14T00:00:00.000Z"
      }
    ],
    "general": {
      "totalSprints": 3,
      "averageDeliveredPoints": 28,
      "averageEfficiency": 93.33333333333333,
      "averageCompletionRate": 93.33333333333333,
      "averageBugResolutionRate": 66.66666666666666,
      "deliveryDistribution": {
        "onTime": 3,
        "partially": 0,
        "late": 0
      }
    }
  }
}
```

2. Estatísticas da Equipe
GET /retrospectives/team-member-stats


Resposta
```bash
{
  "success": true,
  "data": {
    "totalRetrospectives": 4,
    "bySprint": [
      {
        "sprintNumber": 1,
        "averageProductivity": 4,
        "averageTeamClimate": 5,
        "averageCommunication": 3,
        "averageObjectives": 4,
        "averageBlockers": 2,
        "totalResponses": 1,
        "members": [
          "Maria Souza"
        ]
      },
      {
        "sprintNumber": 5,
        "averageProductivity": 4,
        "averageTeamClimate": 5,
        "averageCommunication": 3,
        "averageObjectives": 4,
        "averageBlockers": 2,
        "totalResponses": 3,
        "members": [
          "Maria Souza"
        ]
      }
    ],
    "roleDistribution": {
      "developer": 4
    },
    "overallAverages": {
      "productivity": 4,
      "teamClimate": 5,
      "communication": 3,
      "objectives": 4,
      "blockers": 2
    },
    "byMember": [
      {
        "name": "Maria Souza",
        "role": "developer",
        "totalRetrospectives": 4,
        "averages": {
          "productivity": 4,
          "teamClimate": 5,
          "communication": 3,
          "objectives": 4,
          "blockers": 2
        }
      }
    ]
  }
}
```

📌 Exemplos Práticos
Consultando um intervalo específico:
bash
GET /retrospectives/scrum-master-stats?initialSprint=3&finalSprint=7
Retorna dados apenas das sprints 3 a 7.

Consultando uma sprint específica:
bash
GET /retrospectives/team-member-stats?initialSprint=5&finalSprint=5
Retorna dados apenas da sprint 5.

💡 Dica: Utilize os filtros initialSprint e finalSprint para analisar períodos específicos do seu projeto!

# Explicação de Campos (Scrum Master)

bySprint: Array com estatísticas por sprint

sprintNumber: Número da sprint

scrumMaster: Nome do Scrum Master

velocity: Pontos entregues (velocity)

efficiency: Eficiência (pontos entregues/pontos planejados)

completionRate: Taxa de conclusão (tarefas completadas/total)

bugResolutionRate: Taxa de resolução de bugs (bugs resolvidos/bugs encontrados)

startDate: Data de início

endDate: Data de término

overallStats: Estatísticas consolidadas

totalSprints: Total de sprints consideradas

average*: Médias das métricas

deliveryDistribution: Distribuição de entregas (no prazo, parcial, atrasada)

# Explicação dos Campos (Equipe)

totalRetrospectives: Total de retrospectivas consideradas

bySprint: Estatísticas agrupadas por sprint

sprintNumber: Número da sprint

average*: Médias das notas por categoria

totalResponses: Número de respostas na sprint

members: Nomes dos membros que responderam

roleDistribution: Distribuição de funções/papéis

overallAverages: Médias gerais de todas as retrospectivas

byMember: Estatísticas detalhadas por membro

name: Nome do membro

role: Função do membro

totalRetrospectives: Número de retrospectivas do membro

averages: Médias das notas do membro