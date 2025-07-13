import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';

const usuarioSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  papel: z.enum(['Desenvolvedor', 'Scrum Master', 'Product Owner'], {
    errorMap: () => ({ message: 'Papel inválido. Deve ser: Desenvolvedor, Scrum Master ou Product Owner' })
  }),
});

export class UsuariosController {
  async criar(request: Request, response: Response) {
    const data = usuarioSchema.parse(request.body);

    const usuario = await prisma.usuario.create({
      data,
    });

    return response.status(201).json(usuario);
  }

  async listar(request: Request, response: Response) {
    const usuarios = await prisma.usuario.findMany();
    return response.json(usuarios);
  }

  async buscarPorId(request: Request, response: Response) {
    const { id } = request.params;

    const usuario = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return response.json(usuario);
  }

  async atualizar(request: Request, response: Response) {
    const { id } = request.params;
    const data = usuarioSchema.parse(request.body);

    const usuario = await prisma.usuario.update({
      where: { id },
      data,
    });

    return response.json(usuario);
  }

  async deletar(request: Request, response: Response) {
    const { id } = request.params;

    await prisma.usuario.delete({
      where: { id },
    });

    return response.status(204).send();
  }
} 