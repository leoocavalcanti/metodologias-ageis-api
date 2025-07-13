import { Router } from 'express';
import { avaliacoesPessoaisRoutes } from './avaliacoesPessoais.routes';
import { avaliacoesScrumMasterRoutes } from './avaliacoesScrumMaster.routes';
import { sprintsRoutes } from './sprints.routes';
import { usuariosRoutes } from './usuarios.routes';

const router = Router();

router.use('/usuarios', usuariosRoutes);
router.use('/sprints', sprintsRoutes);
router.use('/avaliacoes-pessoais', avaliacoesPessoaisRoutes);
router.use('/avaliacoes-scrum-master', avaliacoesScrumMasterRoutes);

export { router };
