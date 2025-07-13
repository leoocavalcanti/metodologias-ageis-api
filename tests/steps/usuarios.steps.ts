import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('que eu tenho os seguintes dados do usuário:', function (dataTable) {
  this.dadosUsuario = dataTable.hashes()[0];
  console.log('Dados do usuário:', this.dadosUsuario);
});

Then('o usuário deve ser criado com sucesso', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('id');
  expect(body.nome).toBe(this.dadosUsuario.nome);
  expect(body.papel).toBe(this.dadosUsuario.papel);
}); 