import { Router } from 'express';
import { RetrospectivasController } from '../controllers/RetrospectivasController';

const retrospectivasRoutes = Router();
const retrospectivasController = new RetrospectivasController();

retrospectivasRoutes.post('/scrum-master', retrospectivasController.criarRetrospectivaScrumMaster);
retrospectivasRoutes.post('/team-member', retrospectivasController.criarRetrospectivaTeamMember);
retrospectivasRoutes.get('/scrum-master-stats', retrospectivasController.getScrumMasterStats);
retrospectivasRoutes.get('/team-member-stats', retrospectivasController.getTeamMemberStats);

export { retrospectivasRoutes };
