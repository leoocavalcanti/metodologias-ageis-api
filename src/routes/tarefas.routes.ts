import { Router } from 'express';
import { TarefasController } from '../controllers/TarefasController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const tarefasRouter = Router();
const tarefasController = new TarefasController();

tarefasRouter.use(authMiddleware);

tarefasRouter.post('/', tarefasController.criar);
tarefasRouter.patch('/:id', tarefasController.atualizarStatus);
tarefasRouter.patch('/:id/atribuir', roleMiddleware(['Gerente']), tarefasController.atribuirUsuario);
tarefasRouter.get('/', tarefasController.listar);

export { tarefasRouter };
