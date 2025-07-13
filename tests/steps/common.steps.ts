import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Then('a resposta deve conter os dados do usuário', async function () {
  const response = this.response; // Acessando a resposta do contexto
  const body = await response.json();
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('nome');
  expect(body).toHaveProperty('papel');
});

Then('que eu tenho dados inválidos do usuário:', async function (dataTable) {
  this.dadosUsuario = dataTable.hashes()[0];
}); 