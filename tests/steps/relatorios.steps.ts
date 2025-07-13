import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('existe uma equipe com ID {string} no sistema', function (id: string) {
  this.equipeId = id;
});

Then('a resposta deve conter os dados do relatório', async function () {
  const body = await this.response.json();
  if (this.response.url().includes('/projeto/')) {
    expect(body).toHaveProperty('nome_projeto');
    expect(body).toHaveProperty('data_inicio');
    expect(body).toHaveProperty('progresso_total');
    expect(body).toHaveProperty('tarefas_concluidas');
    expect(body).toHaveProperty('tarefas_pendentes');
  } else if (this.response.url().includes('/equipe/')) {
    expect(body).toHaveProperty('nome_equipe');
    expect(body).toHaveProperty('total_membros');
    expect(body).toHaveProperty('tarefas_concluidas_mes');
    expect(body).toHaveProperty('media_tempo_conclusao');
    expect(body).toHaveProperty('desempenho_geral');
  }
});

Then('o relatório deve incluir as seguintes informações:', async function (dataTable) {
  const body = await this.response.json();
  const campos = dataTable.hashes();
  
  campos.forEach((campo: { campo: string; tipo: string }) => {
    expect(body).toHaveProperty(campo.campo);
    
    switch (campo.tipo) {
      case 'texto':
        expect(typeof body[campo.campo]).toBe('string');
        break;
      case 'número':
        expect(typeof body[campo.campo]).toBe('number');
        break;
      case 'data':
        expect(Date.parse(body[campo.campo])).not.toBeNaN();
        break;
    }
  });
}); 