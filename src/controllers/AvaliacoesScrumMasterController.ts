import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';

const avaliacaoScrumMasterSchema = z.object({
  idSprint: z.string().uuid('ID da sprint inválido'),
  pontosPlanejados: z.number().int().min(0, 'Os pontos planejados devem ser maior ou igual a 0'),
  pontosEntregues: z.number().int().min(0, 'Os pontos entregues devem ser maior ou igual a 0'),
  tarefasPlanejadas: z.number().int().min(0, 'As tarefas planejadas devem ser maior ou igual a 0'),
  tarefasConcluidas: z.number().int().min(0, 'As tarefas concluídas devem ser maior ou igual a 0'),
  tarefasPendentes: z.number().int().min(0, 'As tarefas pendentes devem ser maior ou igual a 0'),
  bugsIdentificados: z.number().int().min(0, 'Os bugs identificados devem ser maior ou igual a 0'),
  bugsResolvidos: z.number().int().min(0, 'Os bugs resolvidos devem ser maior ou igual a 0'),
  houveEntrega: z.enum(['Sim', 'Parcial', 'Não'], {
    errorMap: () => ({ message: 'Status de entrega inválido. Deve ser: Sim, Parcial ou Não' })
  }),
  observacoesGerais: z.string().min(1, 'O campo "Observações gerais" é obrigatório'),
  principaisImpedimentos: z.string().min(1, 'O campo "Principais impedimentos" é obrigatório'),
  melhoriasImplementadas: z.string().min(1, 'O campo "Melhorias implementadas" é obrigatório'),
}).refine((data) => {
  return data.pontosEntregues <= data.pontosPlanejados;
}, {
  message: 'Os pontos entregues não podem ser maiores que os pontos planejados',
  path: ['pontosEntregues'],
}).refine((data) => {
  return data.tarefasConcluidas + data.tarefasPendentes === data.tarefasPlanejadas;
}, {
  message: 'A soma de tarefas concluídas e pendentes deve ser igual ao total de tarefas planejadas',
  path: ['tarefasConcluidas'],
}).refine((data) => {
  return data.bugsResolvidos <= data.bugsIdentificados;
}, {
  message: 'O número de bugs resolvidos não pode ser maior que o número de bugs identificados',
  path: ['bugsResolvidos'],
});

export class AvaliacoesScrumMasterController {
  async criar(request: Request, response: Response) {
    const data = avaliacaoScrumMasterSchema.parse(request.body);

    // Verifica se a sprint existe
    const sprint = await prisma.sprint.findUnique({
      where: { id: data.idSprint },
    });

    if (!sprint) {
      throw new AppError('Sprint não encontrada', 404);
    }

    // Verifica se já existe avaliação para esta sprint
    const avaliacaoExistente = await prisma.avaliacaoScrumMaster.findUnique({
      where: { idSprint: data.idSprint },
    });

    if (avaliacaoExistente) {
      throw new AppError('Já existe uma avaliação do Scrum Master para esta sprint', 400);
    }

    const avaliacaoScrumMaster = await prisma.avaliacaoScrumMaster.create({
      data,
      include: {
        sprint: true,
      },
    });

    return response.status(201).json(avaliacaoScrumMaster);
  }

  async listar(request: Request, response: Response) {
    const { idSprint } = request.query;

    const where: any = {};

    if (idSprint) {
      where.idSprint = idSprint as string;
    }

    const avaliacoesScrumMaster = await prisma.avaliacaoScrumMaster.findMany({
      where,
      include: {
        sprint: true,
      },
    });

    return response.json(avaliacoesScrumMaster);
  }

  async buscarPorId(request: Request, response: Response) {
    const { id } = request.params;

    const avaliacaoScrumMaster = await prisma.avaliacaoScrumMaster.findUnique({
      where: { id },
      include: {
        sprint: true,
      },
    });

    if (!avaliacaoScrumMaster) {
      throw new AppError('Avaliação do Scrum Master não encontrada', 404);
    }

    return response.json(avaliacaoScrumMaster);
  }

  async atualizar(request: Request, response: Response) {
    const { id } = request.params;
    const data = avaliacaoScrumMasterSchema.parse(request.body);

    // Verifica se a avaliação existe
    const avaliacaoExistente = await prisma.avaliacaoScrumMaster.findUnique({
      where: { id },
    });

    if (!avaliacaoExistente) {
      throw new AppError('Avaliação do Scrum Master não encontrada', 404);
    }

    const avaliacaoScrumMaster = await prisma.avaliacaoScrumMaster.update({
      where: { id },
      data,
      include: {
        sprint: true,
      },
    });

    return response.json(avaliacaoScrumMaster);
  }

  async deletar(request: Request, response: Response) {
    const { id } = request.params;

    await prisma.avaliacaoScrumMaster.delete({
      where: { id },
    });

    return response.status(204).send();
  }
} 