import { Router } from 'express';
import { SprintsController } from '../controllers/SprintsController';

const sprintsRoutes = Router();
const sprintsController = new SprintsController();

sprintsRoutes.post('/', sprintsController.criar);
sprintsRoutes.get('/', sprintsController.listar);
sprintsRoutes.get('/:id', sprintsController.buscarPorId);
sprintsRoutes.put('/:id', sprintsController.atualizar);
sprintsRoutes.delete('/:id', sprintsController.deletar);

export { sprintsRoutes };
