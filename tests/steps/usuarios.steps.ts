import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('que eu tenho os seguintes dados do usuário:', function (dataTable) {
  this.dadosUsuario = dataTable.hashes()[0];
  console.log('Dados do usuário:', this.dadosUsuario);
});

When('eu enviar uma requisição POST para {string}', async function (endpoint) {
  console.log('Enviando POST para', endpoint, 'com dados:', this.dadosUsuario);
  this.response = await this.apiContext.post(endpoint, { data: this.dadosUsuario });
  console.log('Resposta:', await this.response.json());
});

Then('devo receber o status {int}', async function (status) {
  expect(this.response.status()).toBe(status);
});

Then('o usuário deve ser criado com sucesso', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('id');
  expect(body.nome).toBe(this.dadosUsuario.nome);
  expect(body.papel).toBe(this.dadosUsuario.papel);
});

Then('devo receber uma mensagem de erro', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('status', 'error');
  expect(body).toHaveProperty('message');
}); 