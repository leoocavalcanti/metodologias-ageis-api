import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

interface AvaliacaoPessoal {
  id?: string;
  idUsuario: string;
  idSprint: string;
  produtividade: number;
  climaEquipe: number;
  comunicacao: number;
  objetivosClaros: number;
  teveBloqueios: number;
  queFuncionou: string;
  queNaoFuncionou: string;
  sugestoesProximaSprint: string;
  comentariosAdicionais?: string;
}

Given('eu tenho os seguintes dados da avaliação pessoal:', function (dataTable) {
  const dados = dataTable.hashes()[0];
  this.dadosAvaliacaoPessoal = {
    ...dados,
    idUsuario: this.usuarioId,
    idSprint: String(this.sprintId),
    produtividade: Number(dados.produtividade),
    climaEquipe: Number(dados.climaEquipe),
    comunicacao: Number(dados.comunicacao),
    objetivosClaros: Number(dados.objetivosClaros),
    teveBloqueios: Number(dados.teveBloqueios)
  };
});

Given('eu tenho dados inválidos da avaliação pessoal:', function (dataTable) {
  const dados = dataTable.hashes()[0];
  this.dadosAvaliacaoPessoal = {
    ...dados,
    idUsuario: this.usuarioId,
    idSprint: String(this.sprintId),
    produtividade: Number(dados.produtividade),
    climaEquipe: Number(dados.climaEquipe),
    comunicacao: Number(dados.comunicacao),
    objetivosClaros: Number(dados.objetivosClaros),
    teveBloqueios: Number(dados.teveBloqueios)
  };
});

Given('eu tenho os seguintes dados para atualização da avaliação pessoal:', function (dataTable) {
  const dados = dataTable.hashes()[0];
  this.dadosAvaliacaoPessoal = {
    ...dados,
    idUsuario: this.usuarioId,
    idSprint: this.sprintId,
    produtividade: Number(dados.produtividade),
    climaEquipe: Number(dados.climaEquipe),
    comunicacao: Number(dados.comunicacao),
    objetivosClaros: Number(dados.objetivosClaros),
    teveBloqueios: Number(dados.teveBloqueios)
  };
});

Given('existe uma avaliação pessoal com ID {string} no sistema', function (id: string) {
  this.avaliacaoId = id;
});

Then('a avaliação pessoal deve ser criada com sucesso', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('idUsuario');
  expect(body).toHaveProperty('idSprint');
  expect(body).toHaveProperty('produtividade');
  expect(body).toHaveProperty('climaEquipe');
  expect(body).toHaveProperty('comunicacao');
  expect(body).toHaveProperty('objetivosClaros');
  expect(body).toHaveProperty('teveBloqueios');
});

Then('a resposta deve conter os dados da avaliação pessoal', async function () {
  const body = await this.response.json();
  expect(body.idUsuario).toBe(this.dadosAvaliacaoPessoal.idUsuario);
  expect(body.idSprint).toBe(this.dadosAvaliacaoPessoal.idSprint);
  expect(body.produtividade).toBe(this.dadosAvaliacaoPessoal.produtividade);
  expect(body.climaEquipe).toBe(this.dadosAvaliacaoPessoal.climaEquipe);
  expect(body.comunicacao).toBe(this.dadosAvaliacaoPessoal.comunicacao);
  expect(body.objetivosClaros).toBe(this.dadosAvaliacaoPessoal.objetivosClaros);
  expect(body.teveBloqueios).toBe(this.dadosAvaliacaoPessoal.teveBloqueios);
});

Then('devo receber mensagens de validação apropriadas para avaliação pessoal', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('errors');
  expect(Array.isArray(body.errors)).toBe(true);
});

Then('a avaliação pessoal deve ser atualizada com sucesso', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('id', this.avaliacaoId);
  expect(body.produtividade).toBe(this.dadosAvaliacaoPessoal.produtividade);
  expect(body.climaEquipe).toBe(this.dadosAvaliacaoPessoal.climaEquipe);
});

Then('devo receber os dados atualizados da avaliação pessoal', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('produtividade');
  expect(body).toHaveProperty('climaEquipe');
  expect(body).toHaveProperty('comunicacao');
  expect(body).toHaveProperty('objetivosClaros');
});

Then('devo receber uma lista de avaliações da sprint', async function () {
  const body = await this.response.json();
  expect(Array.isArray(body)).toBe(true);
  body.forEach((avaliacao: AvaliacaoPessoal) => {
    expect(avaliacao).toHaveProperty('id');
    expect(avaliacao).toHaveProperty('idUsuario');
    expect(avaliacao).toHaveProperty('idSprint', this.sprintId);
  });
}); 