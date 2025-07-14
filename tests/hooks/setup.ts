import { After, AfterAll, Before, BeforeAll, setWorldConstructor } from '@cucumber/cucumber';
import { request } from '@playwright/test';
import { prisma } from '../../src/lib/prisma';

let apiContext: any;

class CustomWorld {
  apiContext!: any;
  steps: any = {};
  stepDefinitions: any = {};
  papel?: string;
}

setWorldConstructor(CustomWorld);

BeforeAll(async function () {
  const apiUrl = process.env.API_URL || 'http://localhost:3000';
  console.log('Usando API URL:', apiUrl);
  
  apiContext = await request.newContext({
    baseURL: apiUrl,
  });
});

Before(async function () {
  this.apiContext = apiContext;
  this.steps = {};
  this.stepDefinitions = {};
});

After(async function () {
  // Limpar dados criados durante o teste
  try {
    await prisma.avaliacaoPessoal.deleteMany();
    await prisma.avaliacaoScrumMaster.deleteMany();
    await prisma.sprint.deleteMany();
    await prisma.usuario.deleteMany();
  } catch (error) {
    console.error('Erro ao limpar o banco de dados:', error);
  }
});

AfterAll(async function () {
  await apiContext.dispose();
}); 