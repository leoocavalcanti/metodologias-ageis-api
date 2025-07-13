import { Router } from 'express';
import { AvaliacoesPessoaisController } from '../controllers/AvaliacoesPessoaisController';

const avaliacoesPessoaisRoutes = Router();
const avaliacoesPessoaisController = new AvaliacoesPessoaisController();

avaliacoesPessoaisRoutes.post('/', avaliacoesPessoaisController.criar);
avaliacoesPessoaisRoutes.get('/', avaliacoesPessoaisController.listar);
avaliacoesPessoaisRoutes.get('/:id', avaliacoesPessoaisController.buscarPorId);
avaliacoesPessoaisRoutes.put('/:id', avaliacoesPessoaisController.atualizar);
avaliacoesPessoaisRoutes.delete('/:id', avaliacoesPessoaisController.deletar);

export { avaliacoesPessoaisRoutes };
