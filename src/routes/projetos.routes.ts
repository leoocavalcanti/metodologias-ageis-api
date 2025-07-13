import { Router } from 'express';
import { ProjetosController } from '../controllers/ProjetosController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const projetosRouter = Router();
const projetosController = new ProjetosController();

projetosRouter.use(authMiddleware);

projetosRouter.post('/', roleMiddleware(['Gerente']), projetosController.criar);
projetosRouter.post('/:id/membros', roleMiddleware(['Gerente']), projetosController.adicionarMembros);
projetosRouter.patch('/:id', roleMiddleware(['Gerente']), projetosController.atualizarStatus);
projetosRouter.get('/', projetosController.listar);

export { projetosRouter };
