import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

interface AvaliacaoScrumMaster {
  id?: string;
  idSprint: string;
  pontosPlanejados: number;
  pontosEntregues: number;
  tarefasPlanejadas: number;
  tarefasConcluidas: number;
  tarefasPendentes: number;
  bugsIdentificados: number;
  bugsResolvidos: number;
  houveEntrega: string;
  observacoesGerais: string;
  principaisImpedimentos: string;
  melhoriasImplementadas: string;
}

Given('eu tenho os seguintes dados da avaliação do Scrum Master:', function (dataTable) {
  const dados = dataTable.hashes()[0];
  this.dadosAvaliacaoScrumMaster = {
    ...dados,
    idSprint: String(this.sprintId),
    pontosPlanejados: Number(dados.pontosPlanejados),
    pontosEntregues: Number(dados.pontosEntregues),
    tarefasPlanejadas: Number(dados.tarefasPlanejadas),
    tarefasConcluidas: Number(dados.tarefasConcluidas),
    tarefasPendentes: Number(dados.tarefasPendentes),
    bugsIdentificados: Number(dados.bugsIdentificados || 0),
    bugsResolvidos: Number(dados.bugsResolvidos || 0),
    houveEntrega: dados.houveEntrega || 'Não',
    observacoesGerais: dados.observacoesGerais || '',
    principaisImpedimentos: dados.principaisImpedimentos || '',
    melhoriasImplementadas: dados.melhoriasImplementadas || ''
  };
});

Given('eu tenho dados inválidos da avaliação do Scrum Master:', function (dataTable) {
  const dados = dataTable.hashes()[0];
  this.dadosAvaliacaoScrumMaster = {
    ...dados,
    idSprint: String(this.sprintId),
    pontosPlanejados: Number(dados.pontosPlanejados),
    pontosEntregues: Number(dados.pontosEntregues),
    tarefasPlanejadas: Number(dados.tarefasPlanejadas),
    tarefasConcluidas: Number(dados.tarefasConcluidas),
    tarefasPendentes: Number(dados.tarefasPendentes),
    bugsIdentificados: Number(dados.bugsIdentificados || 0),
    bugsResolvidos: Number(dados.bugsResolvidos || 0),
    houveEntrega: dados.houveEntrega || 'Não',
    observacoesGerais: dados.observacoesGerais || '',
    principaisImpedimentos: dados.principaisImpedimentos || '',
    melhoriasImplementadas: dados.melhoriasImplementadas || ''
  };
});

Given('existe uma avaliação do Scrum Master para a sprint {string}', function (idSprint: string) {
  this.sprintId = idSprint;
});

Then('a avaliação do Scrum Master deve ser criada com sucesso', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('idSprint');
  expect(body).toHaveProperty('pontosPlanejados');
  expect(body).toHaveProperty('pontosEntregues');
  expect(body).toHaveProperty('tarefasPlanejadas');
  expect(body).toHaveProperty('tarefasConcluidas');
  expect(body).toHaveProperty('tarefasPendentes');
});

Then('a resposta deve conter os dados da avaliação do Scrum Master', async function () {
  const body = await this.response.json();
  expect(body.idSprint).toBe(this.dadosAvaliacaoScrumMaster.idSprint);
  expect(body.pontosPlanejados).toBe(this.dadosAvaliacaoScrumMaster.pontosPlanejados);
  expect(body.pontosEntregues).toBe(this.dadosAvaliacaoScrumMaster.pontosEntregues);
  expect(body.tarefasPlanejadas).toBe(this.dadosAvaliacaoScrumMaster.tarefasPlanejadas);
  expect(body.tarefasConcluidas).toBe(this.dadosAvaliacaoScrumMaster.tarefasConcluidas);
  expect(body.tarefasPendentes).toBe(this.dadosAvaliacaoScrumMaster.tarefasPendentes);
});

Then('devo receber os dados da avaliação do Scrum Master da sprint', async function () {
  const body = await this.response.json();
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('idSprint', this.sprintId);
  expect(body).toHaveProperty('pontosPlanejados');
  expect(body).toHaveProperty('pontosEntregues');
  expect(body).toHaveProperty('tarefasPlanejadas');
  expect(body).toHaveProperty('tarefasConcluidas');
  expect(body).toHaveProperty('tarefasPendentes');
}); 