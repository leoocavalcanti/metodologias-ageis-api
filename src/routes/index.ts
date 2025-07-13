import { Router } from 'express';
import { avaliacoesPessoaisRoutes } from './avaliacoesPessoais.routes';
import { avaliacoesScrumMasterRoutes } from './avaliacoesScrumMaster.routes';
import { projetosRouter } from './projetos.routes';
import { relatoriosRouter } from './relatorios.routes';
import { sprintsRoutes } from './sprints.routes';
import { tarefasRouter } from './tarefas.routes';
import { usuariosRoutes } from './usuarios.routes';

const router = Router();

router.use('/usuarios', usuariosRoutes);
router.use('/projetos', projetosRouter);
router.use('/tarefas', tarefasRouter);
router.use('/relatorios', relatoriosRouter);
router.use('/avaliacoes-pessoais', avaliacoesPessoaisRoutes);
router.use('/avaliacoes-scrum-master', avaliacoesScrumMasterRoutes);
router.use('/sprints', sprintsRoutes);

export { router };
