import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: string;
  estimativa: number;
  status: string;
  usuarioId?: string;
}

Given('eu tenho os seguintes dados da tarefa:', function (dataTable) {
  this.dadosTarefa = dataTable.hashes()[0];
});

Given('eu tenho dados inválidos da tarefa:', function (dataTable) {
  this.dadosTarefa = dataTable.hashes()[0];
});

Given('existe uma tarefa com ID {string} no sistema', function (id: string) {
  this.tarefaId = id;
});

Given('existe um usuário com ID {string} no sistema', function (id: string) {
  this.usuarioId = id;
});

Given('eu tenho o seguinte usuário para atribuição:', function (dataTable) {
  this.dadosAtualizacao = dataTable.hashes()[0];
});

Then('a tarefa deve ser criada com sucesso', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('titulo');
  expect(body).toHaveProperty('descricao');
  expect(body).toHaveProperty('prioridade');
  expect(body).toHaveProperty('estimativa');
  expect(body).toHaveProperty('status');
});

Then('a resposta deve conter os dados da tarefa', async function () {
  const body = await this.response.json();
  expect(body.titulo).toBe(this.dadosTarefa.titulo);
  expect(body.descricao).toBe(this.dadosTarefa.descricao);
  expect(body.prioridade).toBe(this.dadosTarefa.prioridade);
  expect(body.estimativa).toBe(parseInt(this.dadosTarefa.estimativa));
});

Then('devo receber mensagens de validação apropriadas', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('errors');
  expect(Array.isArray(body.errors)).toBe(true);
  
  const mensagensEsperadas = [
    'título é obrigatório',
    'estimativa deve ser maior que 0'
  ];
  
  const errorsLowerCase = body.errors.map((error: string) => error.toLowerCase());
  
  mensagensEsperadas.forEach(mensagem => {
    const mensagemEncontrada = errorsLowerCase.some((error: string) => 
      error.includes(mensagem.toLowerCase())
    );
    expect(mensagemEncontrada).toBe(true);
  });
});

Then('a tarefa deve ser atribuída ao usuário', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('id', this.tarefaId);
  expect(body).toHaveProperty('usuario_id', this.dadosAtualizacao.usuario_id);
});

Then('devo receber uma confirmação da atribuição', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('mensagem', 'Tarefa atribuída com sucesso');
});

Then('devo receber uma lista de tarefas', async function () {
  const body = await this.response.json();
  expect(Array.isArray(body)).toBe(true);
  body.forEach((tarefa: Tarefa) => {
    expect(tarefa).toHaveProperty('id');
    expect(tarefa).toHaveProperty('titulo');
    expect(tarefa).toHaveProperty('status');
    expect(tarefa).toHaveProperty('prioridade');
  });
}); 