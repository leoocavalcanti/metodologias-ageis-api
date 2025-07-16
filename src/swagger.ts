import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Retrospectivas',
    version: '1.0.0',
    description: 'API para gerenciamento de retrospectivas de sprint',
    contact: {
      name: 'Seu Nome',
      email: 'seu@email.com'
    },
  },
  servers: [
    {
      url: 'http://localhost:8000',
      description: 'Servidor de desenvolvimento',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    },
    schemas: {
      ScrumMasterRetrospectiva: {
        type: 'object',
        properties: {
          nome: {
            type: 'string',
            example: 'João Silva'
          },
          papel: {
            type: 'string',
            example: 'Scrum Master'
          },
          sprintNumber: {
            type: 'integer',
            example: 5
          },
          startDate: {
            type: 'string',
            format: 'date',
            example: '2023-01-01'
          },
          endDate: {
            type: 'string',
            format: 'date',
            example: '2023-01-14'
          },
          onTime: {
            type: 'string',
            enum: ['sim', 'nao', 'parcialmente'],
            example: 'sim'
          },
          plannedPoints: {
            type: 'integer',
            example: 30
          },
          deliveredPoints: {
            type: 'integer',
            example: 28
          },
          totalTasks: {
            type: 'integer',
            example: 15
          },
          completedTasks: {
            type: 'integer',
            example: 14
          },
          pendingTasks: {
            type: 'integer',
            example: 1
          },
          bugsFound: {
            type: 'integer',
            example: 3
          },
          bugsResolved: {
            type: 'integer',
            example: 2
          },
          delivery: {
            type: 'string',
            enum: ['sim', 'parcial', 'nao'],
            example: 'sim'
          },
          observations: {
            type: 'string',
            example: 'A sprint foi bem sucedida'
          },
          impediments: {
            type: 'string',
            example: 'Problemas com ambiente de desenvolvimento'
          },
          improvements: {
            type: 'string',
            example: 'Melhorar comunicação entre times'
          }
        }
      },
      TeamMemberRetrospectiva: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'Maria Souza'
          },
          role: {
            type: 'string',
            enum: ['developer', 'qa', 'po', 'scrum-master', 'other'],
            example: 'developer'
          },
          otherRole: {
            type: 'string',
            example: 'UX Designer'
          },
          sprintNumber: {
            type: 'integer',
            example: 5
          },
          productivity: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
            example: 4
          },
          teamClimate: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
            example: 5
          },
          communication: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
            example: 3
          },
          objectives: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
            example: 4
          },
          blockers: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
            example: 2
          },
          whatWorked: {
            type: 'string',
            example: 'A comunicação diária foi eficaz'
          },
          whatDidntWork: {
            type: 'string',
            example: 'Algumas tarefas não estavam bem definidas'
          },
          suggestions: {
            type: 'string',
            example: 'Melhorar a definição de pronto'
          },
          additionalComments: {
            type: 'string',
            example: 'Foi uma sprint produtiva'
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            example: 'Mensagem de erro'
          }
        }
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          message: {
            type: 'string',
            example: 'Operação realizada com sucesso'
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '60d5ecb8f8b1a12b3c4d5e6f'
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2023-06-25T14:30:00Z'
              },
              usuario: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: '60d5ecb8f8b1a12b3c4d5e6f'
                  },
                  nome: {
                    type: 'string',
                    example: 'João Silva'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./src/controllers/*.ts'], // Caminho para os arquivos com as anotações
};

export default options;