import { Router } from 'express';
import { retrospectivasRoutes } from './retrospectivas.routes';
import { usuariosRoutes } from './usuarios.routes';

const router = Router();

router.use('/usuarios', usuariosRoutes);
router.use('/retrospectives', retrospectivasRoutes);

export { router };
