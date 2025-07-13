import { Router } from 'express';
import { RelatoriosController } from '../controllers/RelatoriosController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const relatoriosRouter = Router();
const relatoriosController = new RelatoriosController();

relatoriosRouter.use(authMiddleware);

relatoriosRouter.get('/projeto/:id', roleMiddleware(['Gerente']), relatoriosController.projetoPorId);
relatoriosRouter.get('/equipe/:id', roleMiddleware(['Gerente']), relatoriosController.equipePorId);

export { relatoriosRouter };
