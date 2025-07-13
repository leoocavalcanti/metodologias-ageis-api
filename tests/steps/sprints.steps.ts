import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

interface Sprint {
  id?: string;
  numero: number;
  dataInicio: string;
  dataFim: string;
  encerramentoStatus: boolean;
}

Given('eu tenho os seguintes dados da sprint:', function (dataTable) {
  const dados = dataTable.hashes()[0];
  this.dadosSprint = {
    ...dados,
    numero: Number(dados.numero),
    dataInicio: new Date(dados.dataInicio).toISOString(),
    dataFim: new Date(dados.dataFim).toISOString(),
    encerramentoStatus: dados.encerramentoStatus
  };
});

Given('eu tenho dados inválidos da sprint:', function (dataTable) {
  const dados = dataTable.hashes()[0];
  this.dadosSprint = {
    ...dados,
    numero: Number(dados.numero),
    dataInicio: new Date(dados.dataInicio).toISOString(),
    dataFim: new Date(dados.dataFim).toISOString(),
    encerramentoStatus: dados.encerramentoStatus
  };
});

Given('existe uma sprint com número {string} no sistema', function (numero: string) {
  this.sprintNumero = numero;
});

Given('existe uma sprint com ID {string} no sistema', function (id: string) {
  this.sprintId = id;
});

Given('eu tenho os seguintes dados para atualização da sprint:', function (dataTable) {
  const dados = dataTable.hashes()[0];
  this.dadosAtualizacao = {
    ...dados,
    encerramentoStatus: dados.encerramentoStatus
  };
});

Then('a sprint deve ser criada com sucesso', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('numero');
  expect(body).toHaveProperty('dataInicio');
  expect(body).toHaveProperty('dataFim');
  expect(body).toHaveProperty('encerramentoStatus');
});

Then('a resposta deve conter os dados da sprint', async function () {
  const body = await this.response.json();
  expect(body.numero).toBe(Number(this.dadosSprint.numero));
  expect(body.dataInicio).toBe(this.dadosSprint.dataInicio);
  expect(body.dataFim).toBe(this.dadosSprint.dataFim);
  expect(body.encerramentoStatus).toBe(this.dadosSprint.encerramentoStatus);
});

Then('o status de encerramento deve ser atualizado', async function () {
  const body = await this.response.json();
  expect(body.encerramentoStatus).toBe(this.dadosAtualizacao.encerramentoStatus);
});

Then('devo receber os dados atualizados da sprint', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('numero');
  expect(body).toHaveProperty('dataInicio');
  expect(body).toHaveProperty('dataFim');
  expect(body).toHaveProperty('encerramentoStatus');
});

Then('devo receber uma lista de sprints', async function () {
  const body = await this.response.json();
  expect(Array.isArray(body)).toBe(true);
  body.forEach((sprint: Sprint) => {
    expect(sprint).toHaveProperty('id');
    expect(sprint).toHaveProperty('numero');
    expect(sprint).toHaveProperty('dataInicio');
    expect(sprint).toHaveProperty('dataFim');
    expect(sprint).toHaveProperty('encerramentoStatus');
  });
}); 