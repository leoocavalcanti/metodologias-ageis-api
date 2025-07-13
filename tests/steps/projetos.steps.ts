import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  status: string;
  data_inicio: string;
  data_fim: string;
}

interface ProjetoResponse {
  id: string;
  nome: string;
  descricao: string;
  status: string;
  data_inicio: string;
  data_fim: string;
  membros?: string[];
  message?: string;
  error?: string;
}

Given('eu tenho os seguintes dados do projeto:', function (dataTable) {
  this.dadosProjeto = dataTable.hashes()[0];
});

Given('existe um projeto com ID {string} no sistema', function (id: string) {
  this.projetoId = id;
});

Given('existem os seguintes usuários no sistema:', function (dataTable) {
  this.usuariosSistema = dataTable.hashes();
});

Given('eu tenho os seguintes IDs de usuários para adicionar:', function (dataTable) {
  this.usuariosParaAdicionar = dataTable.hashes()[0];
});

Given('eu tenho o seguinte status para atualização:', function (dataTable) {
  this.statusAtualizacao = dataTable.hashes()[0];
});

Given('eu tenho os seguintes filtros de busca:', function (dataTable) {
  this.filtrosBusca = dataTable.hashes()[0];
});

Given('eu tenho dados inválidos do projeto:', function (dataTable) {
  this.dadosProjeto = dataTable.hashes()[0];
});

Then('o projeto deve ser criado com sucesso', async function () {
  const body = await this.response.json() as ProjetoResponse;
  expect(body).toHaveProperty('id');
  expect(body.nome).toBe(this.dadosProjeto.nome);
  expect(body.descricao).toBe(this.dadosProjeto.descricao);
});

Then('os membros devem ser adicionados ao projeto', async function () {
  const body = await this.response.json() as ProjetoResponse;
  expect(body).toHaveProperty('membros_adicionados');
  expect(body).toHaveProperty('message');
  expect(body).toHaveProperty('projeto_id');
});

Then('devo receber uma confirmação da adição', async function () {
  const body = await this.response.json() as ProjetoResponse;
  expect(body).toHaveProperty('message', 'Membros adicionados com sucesso');
});

Then('o status do projeto deve ser atualizado', async function () {
  const body = await this.response.json() as ProjetoResponse;
  expect(body.status).toBe(this.statusAtualizacao.status);
});

Then('devo receber os dados atualizados do projeto', async function () {
  const body = await this.response.json() as ProjetoResponse;
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('status');
});

Then('devo receber uma lista de projetos', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('projetos');
  expect(Array.isArray(body.projetos)).toBe(true);
});

Then('todos os projetos devem ter status {string}', async function (status: string) {
  const body = await this.response.json();
  body.projetos.forEach((projeto: Projeto) => {
    expect(projeto.status).toBe(status);
  });
});

Then('todos os projetos devem ter data de início após {string}', async function (data: string) {
  const body = await this.response.json();
  const dataLimite = new Date(data);
  body.projetos.forEach((projeto: Projeto) => {
    const dataInicio = new Date(projeto.data_inicio);
    expect(dataInicio.getTime()).toBeGreaterThanOrEqual(dataLimite.getTime());
  });
});

Then('devo receber uma mensagem de erro {string}', async function (mensagem: string) {
  const body = await this.response.json();
  expect(body).toHaveProperty('error', mensagem);
});

Then('a resposta deve conter os dados do projeto', async function () {
  const body = await this.response.json() as ProjetoResponse;
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('nome');
  expect(body).toHaveProperty('descricao');
  expect(body).toHaveProperty('status');
  expect(body).toHaveProperty('data_inicio');
  expect(body).toHaveProperty('data_fim');
}); 