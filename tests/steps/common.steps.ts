import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

interface DadosRequest {
  [key: string]: string | number | boolean;
}

// Steps de autenticação
Given('que eu estou autenticado como {string}', function (papel: string) {
  this.papel = papel;
});

// Steps HTTP comuns
When('eu enviar uma requisição POST para {string}', async function (endpoint: string) {
  const dados = endpoint.includes('usuarios') ? this.dadosUsuario :
                endpoint.includes('sprints') ? this.dadosSprint :
                endpoint.includes('avaliacoes-pessoais') ? this.dadosAvaliacaoPessoal :
                endpoint.includes('avaliacoes-scrum-master') ? this.dadosAvaliacaoScrumMaster :
                {};

  // Converte strings numéricas para números e trata booleanos
  const dadosConvertidos = Object.entries(dados).reduce<DadosRequest>((acc, [key, value]: [string, any]) => {
    if (typeof value === 'string') {
      if (!isNaN(Number(value))) {
        acc[key] = Number(value);
      } else if (value === 'Sim' || value === 'Não') {
        acc[key] = value === 'Sim';
      } else {
        acc[key] = value;
      }
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});

  // Log dos dados enviados para debug
  console.log('Dados enviados:', JSON.stringify(dadosConvertidos, null, 2));
                
  this.response = await this.apiContext.post(endpoint, { 
    data: dadosConvertidos,
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': this.papel
    }
  });

  // Log da resposta para debug
  if (this.response.status() !== 201) {
    const body = await this.response.json();
    console.log('Resposta de erro:', JSON.stringify(body, null, 2));
  }
});

When('eu enviar uma requisição GET para {string}', async function (endpoint: string) {
  this.response = await this.apiContext.get(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': this.papel
    }
  });
});

When('eu enviar uma requisição PUT para {string}', async function (endpoint: string) {
  const dados = endpoint.includes('usuarios') ? this.dadosUsuario :
                endpoint.includes('sprints') ? this.dadosAtualizacao :
                endpoint.includes('avaliacoes-pessoais') ? this.dadosAvaliacaoPessoal :
                endpoint.includes('avaliacoes-scrum-master') ? this.dadosAvaliacaoScrumMaster :
                {};

  // Converte strings numéricas para números e trata booleanos
  const dadosConvertidos = Object.entries(dados).reduce<DadosRequest>((acc, [key, value]: [string, any]) => {
    if (typeof value === 'string') {
      if (!isNaN(Number(value))) {
        acc[key] = Number(value);
      } else if (value === 'Sim' || value === 'Não') {
        acc[key] = value === 'Sim';
      } else {
        acc[key] = value;
      }
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});

  // Log dos dados enviados para debug
  console.log('Dados enviados:', JSON.stringify(dadosConvertidos, null, 2));

  this.response = await this.apiContext.put(endpoint, {
    data: dadosConvertidos,
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': this.papel
    }
  });

  // Log da resposta para debug
  if (this.response.status() !== 200) {
    const body = await this.response.json();
    console.log('Resposta de erro:', JSON.stringify(body, null, 2));
  }
});

When('eu enviar uma requisição DELETE para {string}', async function (endpoint: string) {
  this.response = await this.apiContext.delete(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': this.papel
    }
  });
});

Then('devo receber o status {int}', async function (status: number) {
  expect(this.response.status()).toBe(status);
});

Then('devo receber uma mensagem de erro {string}', async function (mensagem: string) {
  const body = await this.response.json();
  const mensagemRecebida = body.message || body.error || (body.errors && body.errors[0]);
  expect(mensagemRecebida).toBe(mensagem);
}); 