# API de Avaliações de Sprint

API para gerenciamento de avaliações de sprint, incluindo avaliações pessoais dos membros da equipe e avaliações do Scrum Master.

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- Prisma (ORM)
- PostgreSQL
- Zod (Validação)
- Cucumber (BDD)
- Playwright (Testes de API)

## Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd metodologias-ageis-api
```

2. Instale as dependências:
```bash
npm install
# ou
yarn
```

3. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Ajuste as variáveis conforme seu ambiente:
  ```
  DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/metodologias_ageis?schema=public"
  JWT_SECRET="seu_jwt_secret_aqui"
  PORT=3000
  ```

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

5. Inicie o servidor:
```bash
npm run dev
# ou
yarn dev
```

## Estrutura do Projeto

```
src/
  ├── controllers/     # Controladores da aplicação
  ├── middlewares/    # Middlewares do Express
  ├── routes/         # Rotas da API
  ├── lib/           # Configurações e utilitários
  └── server.ts      # Arquivo principal

tests/
  ├── features/      # Arquivos .feature com cenários BDD
  ├── steps/         # Implementação dos steps do BDD
  └── hooks/         # Hooks para setup e teardown dos testes
```

## Endpoints da API

### Usuários

- `POST /usuarios` - Criar usuário
- `GET /usuarios` - Listar usuários
- `GET /usuarios/:id` - Buscar usuário por ID
- `PUT /usuarios/:id` - Atualizar usuário
- `DELETE /usuarios/:id` - Remover usuário

### Sprints

- `POST /sprints` - Criar sprint
- `GET /sprints` - Listar sprints
- `GET /sprints/:id` - Buscar sprint por ID
- `PUT /sprints/:id` - Atualizar sprint
- `DELETE /sprints/:id` - Remover sprint

### Avaliações Pessoais

- `POST /avaliacoes-pessoais` - Criar avaliação pessoal
- `GET /avaliacoes-pessoais` - Listar avaliações pessoais
- `GET /avaliacoes-pessoais/:id` - Buscar avaliação por ID
- `PUT /avaliacoes-pessoais/:id` - Atualizar avaliação
- `DELETE /avaliacoes-pessoais/:id` - Remover avaliação

### Avaliações do Scrum Master

- `POST /avaliacoes-scrum-master` - Criar avaliação do Scrum Master
- `GET /avaliacoes-scrum-master` - Listar avaliações do Scrum Master
- `GET /avaliacoes-scrum-master/:id` - Buscar avaliação por ID
- `PUT /avaliacoes-scrum-master/:id` - Atualizar avaliação
- `DELETE /avaliacoes-scrum-master/:id` - Remover avaliação

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm start` - Inicia o servidor em modo de produção
- `npm run test:bdd` - Executa os testes BDD

## Testes BDD

O projeto utiliza Cucumber para testes BDD (Behavior Driven Development) em conjunto com Playwright para testes de API. Os testes são executados automaticamente em cada Pull Request através do GitHub Actions.

### Estrutura dos Testes

- `tests/features/*.feature` - Arquivos com cenários de teste em linguagem Gherkin
- `tests/steps/*.ts` - Implementação dos steps dos testes
- `tests/hooks/*.ts` - Configuração e limpeza do ambiente de testes

### Executando os Testes

1. Certifique-se de que a API está rodando:
```bash
npm run dev
```

2. Em outro terminal, execute os testes:
```bash
npm run test:bdd
```

### Relatório de Testes

Após a execução dos testes, um relatório HTML será gerado em `cucumber-report.html`. Este relatório contém informações detalhadas sobre os testes executados, incluindo:

- Cenários executados
- Status de cada cenário (passou/falhou)
- Screenshots em caso de falha
- Tempo de execução
- Logs detalhados

## Integração Contínua

O projeto utiliza GitHub Actions para executar os testes automaticamente em cada Pull Request. O workflow inclui:

1. Setup do ambiente (Node.js, PostgreSQL)
2. Instalação de dependências
3. Execução das migrações do banco
4. Execução dos testes BDD
5. Geração e upload do relatório de testes

## Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença ISC. 