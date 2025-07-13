import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('que eu tenho os seguintes dados do usuário:', function (dataTable) {
  this.dadosUsuario = dataTable.hashes()[0];
});

Given('que eu tenho dados inválidos do usuário:', function (dataTable) {
  this.dadosUsuario = dataTable.hashes()[0];
});

Then('o usuário deve ser criado com sucesso', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('nome');
  expect(body).toHaveProperty('papel');
});

Then('a resposta deve conter os dados do usuário', async function () {
  const body = await this.response.json();
  expect(body.nome).toBe(this.dadosUsuario.nome);
  expect(body.papel).toBe(this.dadosUsuario.papel);
});

Then('devo receber uma mensagem de erro', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('status', 'error');
  expect(body).toHaveProperty('message');
  expect(typeof body.message).toBe('string');
}); 