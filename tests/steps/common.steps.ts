import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Steps de autenticação
Given('que eu estou autenticado como {string}', function (papel: string) {
  this.papel = papel;
});

// Steps HTTP comuns
When('eu enviar uma requisição POST para {string}', async function (endpoint: string) {
  const dados = endpoint.includes('membros') ? this.usuariosParaAdicionar : 
                endpoint.includes('usuarios') ? this.dadosUsuario :
                endpoint.includes('tarefas') ? this.dadosTarefa :
                this.dadosProjeto;
                
  this.response = await this.apiContext.post(endpoint, { 
    data: dados,
    headers: {
      'x-user-role': this.papel
    }
  });
});

When('eu enviar uma requisição PATCH para {string}', async function (endpoint: string) {
  const dados = endpoint.includes('atribuir') ? this.usuarioAtribuicao : this.statusAtualizacao;
  this.response = await this.apiContext.patch(endpoint, { 
    data: dados,
    headers: {
      'x-user-role': this.papel
    }
  });
});

When('eu enviar uma requisição GET para {string}', async function (endpoint: string) {
  const queryParams = this.filtrosBusca ? new URLSearchParams(this.filtrosBusca).toString() : '';
  const url = queryParams ? `${endpoint}?${queryParams}` : endpoint;
  this.response = await this.apiContext.get(url, {
    headers: {
      'x-user-role': this.papel
    }
  });
});

// Steps de validação comuns
Then('devo receber o status {int}', async function (status: number) {
  expect(this.response.status()).toBe(status);
});

Then('a resposta deve conter os dados do usuário', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('nome');
  expect(body).toHaveProperty('papel');
});

Then('que eu tenho dados inválidos do usuário:', async function (dataTable) {
  this.dadosUsuario = dataTable.hashes()[0];
});

Then('devo receber uma mensagem de erro', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('status', 'error');
  expect(body).toHaveProperty('message');
}); 