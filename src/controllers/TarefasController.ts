import { Request, Response } from 'express';

export class TarefasController {
  async criar(req: Request, res: Response) {
    const { titulo, descricao, prioridade, estimativa } = req.body;

    // Validação dos dados
    if (!titulo || estimativa < 0) {
      return res.status(400).json({
        errors: {
          titulo: !titulo ? 'Título é obrigatório' : undefined,
          estimativa: estimativa < 0 ? 'Estimativa deve ser um número positivo' : undefined
        }
      });
    }

    // TODO: Implementar lógica de criação da tarefa
    return res.status(201).json({
      id: '789',
      titulo,
      descricao,
      prioridade,
      estimativa,
      status: 'Pendente'
    });
  }

  async atualizarStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    // TODO: Implementar lógica de atualização de status
    return res.status(200).json({
      id,
      status,
      mensagem: 'Status atualizado com sucesso'
    });
  }

  async atribuirUsuario(req: Request, res: Response) {
    const { id } = req.params;
    const { usuario_id } = req.body;

    // TODO: Implementar lógica de atribuição de usuário
    return res.status(200).json({
      id,
      usuario_id,
      mensagem: 'Tarefa atribuída com sucesso'
    });
  }

  async listar(req: Request, res: Response) {
    const { status, prioridade } = req.query;

    // TODO: Implementar lógica de listagem com filtros
    return res.status(200).json({
      tarefas: [
        {
          id: '789',
          titulo: 'Tarefa Teste',
          status: status || 'Em Andamento',
          prioridade: prioridade || 'Alta'
        }
      ]
    });
  }
} 