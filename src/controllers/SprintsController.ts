import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';

const sprintSchema = z.object({
  numero: z.number().int().positive('O número da sprint deve ser positivo'),
  dataInicio: z.string().datetime('Data de início inválida'),
  dataFim: z.string().datetime('Data de fim inválida'),
  encerramentoStatus: z.enum(['Sim', 'Não', 'Parcialmente'], {
    errorMap: () => ({ message: 'Status de encerramento inválido. Deve ser: Sim, Não ou Parcialmente' })
  }),
}).refine((data) => {
  const inicio = new Date(data.dataInicio);
  const fim = new Date(data.dataFim);
  return inicio < fim;
}, {
  message: 'A data de início deve ser anterior à data de fim',
  path: ['dataInicio'],
});

export class SprintsController {
  async criar(request: Request, response: Response) {
    const data = sprintSchema.parse(request.body);

    // Verifica se já existe uma sprint com o mesmo número
    const sprintExistente = await prisma.sprint.findFirst({
      where: { numero: data.numero },
    });

    if (sprintExistente) {
      throw new AppError('Já existe uma sprint com este número', 400);
    }

    const sprint = await prisma.sprint.create({
      data: {
        numero: data.numero,
        dataInicio: new Date(data.dataInicio),
        dataFim: new Date(data.dataFim),
        encerramentoStatus: data.encerramentoStatus,
      },
    });

    return response.status(201).json(sprint);
  }

  async listar(request: Request, response: Response) {
    const sprints = await prisma.sprint.findMany({
      orderBy: { numero: 'desc' },
      include: {
        avaliacaoScrumMaster: true,
        avaliacoesPessoais: {
          include: {
            usuario: true,
          },
        },
      },
    });

    return response.json(sprints);
  }

  async buscarPorId(request: Request, response: Response) {
    const { id } = request.params;

    const sprint = await prisma.sprint.findUnique({
      where: { id },
      include: {
        avaliacaoScrumMaster: true,
        avaliacoesPessoais: {
          include: {
            usuario: true,
          },
        },
      },
    });

    if (!sprint) {
      throw new AppError('Sprint não encontrada', 404);
    }

    return response.json(sprint);
  }

  async atualizar(request: Request, response: Response) {
    const { id } = request.params;
    const data = sprintSchema.parse(request.body);

    const sprint = await prisma.sprint.update({
      where: { id },
      data: {
        numero: data.numero,
        dataInicio: new Date(data.dataInicio),
        dataFim: new Date(data.dataFim),
        encerramentoStatus: data.encerramentoStatus,
      },
    });

    return response.json(sprint);
  }

  async deletar(request: Request, response: Response) {
    const { id } = request.params;

    await prisma.sprint.delete({
      where: { id },
    });

    return response.status(204).send();
  }
} 