import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';

const avaliacaoPessoalSchema = z.object({
  idUsuario: z.string().uuid('ID do usuário inválido'),
  idSprint: z.string().uuid('ID da sprint inválido'),
  produtividade: z.number().int().min(1, 'A produtividade deve ser entre 1 e 5').max(5, 'A produtividade deve ser entre 1 e 5'),
  climaEquipe: z.number().int().min(1, 'O clima da equipe deve ser entre 1 e 5').max(5, 'O clima da equipe deve ser entre 1 e 5'),
  comunicacao: z.number().int().min(1, 'A comunicação deve ser entre 1 e 5').max(5, 'A comunicação deve ser entre 1 e 5'),
  objetivosClaros: z.number().int().min(1, 'Os objetivos claros devem ser entre 1 e 5').max(5, 'Os objetivos claros devem ser entre 1 e 5'),
  teveBloqueios: z.number().int().min(0, 'Teve bloqueios deve ser 0 ou 1').max(1, 'Teve bloqueios deve ser 0 ou 1'),
  queFuncionou: z.string().min(1, 'O campo "O que funcionou" é obrigatório'),
  queNaoFuncionou: z.string().min(1, 'O campo "O que não funcionou" é obrigatório'),
  sugestoesProximaSprint: z.string().min(1, 'O campo "Sugestões para próxima sprint" é obrigatório'),
  comentariosAdicionais: z.string().optional(),
});

export class AvaliacoesPessoaisController {
  async criar(request: Request, response: Response) {
    const data = avaliacaoPessoalSchema.parse(request.body);

    // Verifica se o usuário existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: data.idUsuario },
    });

    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Verifica se a sprint existe
    const sprint = await prisma.sprint.findUnique({
      where: { id: data.idSprint },
    });

    if (!sprint) {
      throw new AppError('Sprint não encontrada', 404);
    }

    // Verifica se o usuário já avaliou esta sprint
    const avaliacaoExistente = await prisma.avaliacaoPessoal.findFirst({
      where: {
        idUsuario: data.idUsuario,
        idSprint: data.idSprint,
      },
    });

    if (avaliacaoExistente) {
      throw new AppError('Usuário já avaliou esta sprint', 400);
    }

    const avaliacaoPessoal = await prisma.avaliacaoPessoal.create({
      data,
      include: {
        usuario: true,
        sprint: true,
      },
    });

    return response.status(201).json(avaliacaoPessoal);
  }

  async listar(request: Request, response: Response) {
    const { idSprint, idUsuario } = request.query;

    const where: any = {};

    if (idSprint) {
      where.idSprint = idSprint as string;
    }

    if (idUsuario) {
      where.idUsuario = idUsuario as string;
    }

    const avaliacoesPessoais = await prisma.avaliacaoPessoal.findMany({
      where,
      include: {
        usuario: true,
        sprint: true,
      },
    });

    return response.json(avaliacoesPessoais);
  }

  async buscarPorId(request: Request, response: Response) {
    const { id } = request.params;

    const avaliacaoPessoal = await prisma.avaliacaoPessoal.findUnique({
      where: { id },
      include: {
        usuario: true,
        sprint: true,
      },
    });

    if (!avaliacaoPessoal) {
      throw new AppError('Avaliação pessoal não encontrada', 404);
    }

    return response.json(avaliacaoPessoal);
  }

  async atualizar(request: Request, response: Response) {
    const { id } = request.params;
    const data = avaliacaoPessoalSchema.parse(request.body);

    // Verifica se a avaliação existe
    const avaliacaoExistente = await prisma.avaliacaoPessoal.findUnique({
      where: { id },
    });

    if (!avaliacaoExistente) {
      throw new AppError('Avaliação pessoal não encontrada', 404);
    }

    const avaliacaoPessoal = await prisma.avaliacaoPessoal.update({
      where: { id },
      data,
      include: {
        usuario: true,
        sprint: true,
      },
    });

    return response.json(avaliacaoPessoal);
  }

  async deletar(request: Request, response: Response) {
    const { id } = request.params;

    await prisma.avaliacaoPessoal.delete({
      where: { id },
    });

    return response.status(204).send();
  }
} 