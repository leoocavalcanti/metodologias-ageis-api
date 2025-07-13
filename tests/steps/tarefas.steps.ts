import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  status: string;
  prioridade: string;
  usuario_id?: string;
}

interface TarefaResponse {
  id: string;
  titulo: string;
  descricao: string;
  status: string;
  prioridade: string;
  usuario_id?: string;
  message?: string;
  errors?: string[];
}

Given('eu tenho os seguintes dados da tarefa:', function (dataTable) {
  this.dadosTarefa = dataTable.hashes()[0];
});

Given('existe uma tarefa com ID {string} no sistema', function (id: string) {
  this.tarefaId = id;
});

Given('existe um usuário com ID {string} no sistema', function (id: string) {
  this.usuarioId = id;
});

Given('eu tenho o seguinte usuário para atribuição:', function (dataTable) {
  this.usuarioAtribuicao = dataTable.hashes()[0];
});

Given('eu tenho dados inválidos da tarefa:', function (dataTable) {
  this.dadosTarefa = dataTable.hashes()[0];
});

Then('a tarefa deve ser criada com sucesso', async function () {
  const body = await this.response.json() as TarefaResponse;
  expect(body).toHaveProperty('id');
  expect(body.titulo).toBe(this.dadosTarefa.titulo);
  expect(body.descricao).toBe(this.dadosTarefa.descricao);
});

Then('a resposta deve conter os dados da tarefa', async function () {
  const body = await this.response.json() as TarefaResponse;
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('titulo');
  expect(body).toHaveProperty('descricao');
  expect(body).toHaveProperty('status');
  expect(body).toHaveProperty('prioridade');
});

Then('devo receber uma confirmação da atribuição', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('mensagem', 'Tarefa atribuída com sucesso');
});

Then('o status da tarefa deve ser atualizado', async function () {
  const body = await this.response.json() as TarefaResponse;
  expect(body.status).toBe(this.statusAtualizacao.status);
});

Then('devo receber os dados atualizados da tarefa', async function () {
  const body = await this.response.json() as TarefaResponse;
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('status');
});

Then('a tarefa deve ser atribuída ao usuário', async function () {
  const body = await this.response.json() as TarefaResponse;
  expect(body.usuario_id).toBe(this.usuarioAtribuicao.usuario_id);
});

Then('devo receber uma lista de tarefas', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('tarefas');
  expect(Array.isArray(body.tarefas)).toBe(true);
});

Then('todas as tarefas devem ter status {string}', async function (status: string) {
  const body = await this.response.json();
  body.tarefas.forEach((tarefa: Tarefa) => {
    expect(tarefa.status).toBe(status);
  });
});

Then('todas as tarefas devem ter prioridade {string}', async function (prioridade: string) {
  const body = await this.response.json();
  body.tarefas.forEach((tarefa: Tarefa) => {
    expect(tarefa.prioridade).toBe(prioridade);
  });
});

Then('devo receber mensagens de validação apropriadas', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('errors');
  const errors = Array.isArray(body.errors) ? body.errors : [body.errors];
  expect(errors.length).toBeGreaterThan(0);
  
  console.log('Resposta do servidor:', JSON.stringify(body, null, 2));
  console.log('Erros recebidos:', errors);
  
  // Verificar se as mensagens esperadas estão presentes
  const mensagensEsperadas = [
    'titulo',
    'estimativa'
  ];
  
  const errorsLowerCase = errors.map((error: any) => {
    if (typeof error === 'object' && error !== null) {
      return JSON.stringify(error).toLowerCase();
    }
    return String(error).toLowerCase();
  });

  console.log('Erros convertidos:', errorsLowerCase);
  
  mensagensEsperadas.forEach(mensagem => {
    const mensagemEncontrada = errorsLowerCase.some((error: string) => 
      error.includes(mensagem.toLowerCase())
    );
    expect(mensagemEncontrada, `Mensagem esperada não encontrada: ${mensagem}`).toBe(true);
  });
}); 