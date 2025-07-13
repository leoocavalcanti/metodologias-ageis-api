import { Router } from 'express';
import { AvaliacoesScrumMasterController } from '../controllers/AvaliacoesScrumMasterController';

const avaliacoesScrumMasterRoutes = Router();
const avaliacoesScrumMasterController = new AvaliacoesScrumMasterController();

avaliacoesScrumMasterRoutes.post('/', avaliacoesScrumMasterController.criar);
avaliacoesScrumMasterRoutes.get('/', avaliacoesScrumMasterController.listar);
avaliacoesScrumMasterRoutes.get('/:id', avaliacoesScrumMasterController.buscarPorId);
avaliacoesScrumMasterRoutes.put('/:id', avaliacoesScrumMasterController.atualizar);
avaliacoesScrumMasterRoutes.delete('/:id', avaliacoesScrumMasterController.deletar);

export { avaliacoesScrumMasterRoutes };
