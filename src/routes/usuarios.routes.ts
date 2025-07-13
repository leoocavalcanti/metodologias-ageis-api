import { Router } from 'express';
import { UsuariosController } from '../controllers/UsuariosController';

const usuariosRoutes = Router();
const usuariosController = new UsuariosController();

usuariosRoutes.post('/', usuariosController.criar);
usuariosRoutes.get('/', usuariosController.listar);
usuariosRoutes.get('/:id', usuariosController.buscarPorId);
usuariosRoutes.put('/:id', usuariosController.atualizar);
usuariosRoutes.delete('/:id', usuariosController.deletar);

export { usuariosRoutes };
