import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { RetrospectivaModel } from '../models/Retrospectiva';

interface IScrumMasterRetrospectiva {
  nome: string;
  papel: string;
  sprintNumber: number;
  startDate: string;
  endDate: string;
  onTime: 'sim' | 'nao' | 'parcialmente';
  plannedPoints: number;
  deliveredPoints: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  bugsFound: number;
  bugsResolved: number;
  delivery: 'sim' | 'parcial' | 'nao';
  observations: string;
  impediments: string;
  improvements: string;
}

interface ITeamMemberRetrospectiva {
  name: string;
  role: 'developer' | 'qa' | 'po' | 'scrum-master' | 'other';
  otherRole?: string;
  sprintNumber: number;
  productivity: number;
  teamClimate: number;
  communication: number;
  objectives: number;
  blockers: number;
  whatWorked: string;
  whatDidntWork: string;
  suggestions: string;
  additionalComments?: string;
}


/**
 * @swagger
 * tags:
 *   name: Retrospectives
 *   description: Gerenciamento de retrospectivas de sprint
 */
export class RetrospectivasController {
  private retrospectivaModel: RetrospectivaModel;

  constructor() {
    this.retrospectivaModel = new RetrospectivaModel();
    this.criarRetrospectivaScrumMaster = this.criarRetrospectivaScrumMaster.bind(this);
    this.criarRetrospectivaTeamMember = this.criarRetrospectivaTeamMember.bind(this);
    this.getScrumMasterStats = this.getScrumMasterStats.bind(this);
    this.getTeamMemberStats = this.getTeamMemberStats.bind(this);
  }


/**
   * @swagger
   * /retrospectives/scrum-master:
   *   post:
   *     summary: Cria uma nova retrospectiva do Scrum Master
   *     tags: [Retrospectives]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ScrumMasterRetrospectiva'
   *     responses:
   *       201:
   *         description: Retrospectiva criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       400:
   *         description: Dados inválidos fornecidos
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async criarRetrospectivaScrumMaster(req: Request, res: Response) {
    try {
      const dados: IScrumMasterRetrospectiva = req.body;

      // Validações básicas
      if (!dados.nome || !dados.papel || !dados.sprintNumber || !dados.startDate || !dados.endDate) {
        return res.status(400).json({
          success: false,
          message: 'Dados obrigatórios não fornecidos'
        });
      }

      // Validações adicionais
      if (!dados.plannedPoints || !dados.deliveredPoints || !dados.totalTasks) {
        return res.status(400).json({
          success: false,
          message: 'Dados quantitativos são obrigatórios'
        });
      }

      // Validar datas
      const startDate = new Date(dados.startDate);
      const endDate = new Date(dados.endDate);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Datas inválidas fornecidas'
        });
      }

      if (endDate < startDate) {
        return res.status(400).json({
          success: false,
          message: 'A data de término não pode ser anterior à data de início'
        });
      }

      // Criar retrospectiva
      const retrospectiva = await this.retrospectivaModel.criarRetrospectivaScrumMaster(dados);
      
      return res.status(201).json({
        success: true,
        message: 'Retrospectiva do Scrum Master registrada com sucesso',
        data: {
          id: retrospectiva.id,
          createdAt: retrospectiva.createdAt,
          usuario: {
            id: retrospectiva.usuario.id,
            nome: retrospectiva.usuario.nome
          }
        }
      });
    } catch (error) {
      console.error('Erro ao criar retrospectiva do Scrum Master:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

    /**
   * @swagger
   * /retrospectives/team-member:
   *   post:
   *     summary: Cria uma nova retrospectiva de membro da equipe
   *     tags: [Retrospectives]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TeamMemberRetrospectiva'
   *     responses:
   *       201:
   *         description: Retrospectiva criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       400:
   *         description: Dados inválidos fornecidos
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async criarRetrospectivaTeamMember(req: Request, res: Response) {
    try {
      const dados: ITeamMemberRetrospectiva = req.body;

      // Validações básicas
      if (!dados.name || !dados.role || !dados.sprintNumber) {
        return res.status(400).json({
          success: false,
          message: 'Dados obrigatórios não fornecidos'
        });
      }

      // Validação adicional para role "other"
      if (dados.role === 'other' && !dados.otherRole) {
        return res.status(400).json({
          success: false,
          message: 'Especificação do papel é obrigatória quando "other" é selecionado'
        });
      }

      // Validação das notas (1-5)
      const ratings = [dados.productivity, dados.teamClimate, dados.communication, dados.objectives, dados.blockers];
      if (ratings.some(rating => rating < 1 || rating > 5)) {
        return res.status(400).json({
          success: false,
          message: 'As avaliações devem estar entre 1 e 5'
        });
      }

      // Validações dos campos de texto
      if (!dados.whatWorked || !dados.whatDidntWork || !dados.suggestions) {
        return res.status(400).json({
          success: false,
          message: 'Os campos de feedback qualitativo são obrigatórios'
        });
      }

      // Criar retrospectiva
      const retrospectiva = await this.retrospectivaModel.criarRetrospectivaTeamMember(dados);

      return res.status(201).json({
        success: true,
        message: 'Retrospectiva do membro da equipe registrada com sucesso',
        data: {
          id: retrospectiva.id,
          createdAt: retrospectiva.createdAt,
          usuario: {
            id: retrospectiva.usuario.id,
            nome: retrospectiva.usuario.nome
          }
        }
      });
    } catch (error) {
      console.error('Erro ao criar retrospectiva do membro da equipe:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
 * @swagger
 * /retrospectives/scrum-master-stats:
 *   get:
 *     summary: Get Scrum Master retrospective statistics
 *     tags: [Retrospectives]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: initialSprint
 *         schema:
 *           type: integer
 *         description: Initial sprint number for filtering
 *       - in: query
 *         name: finalSprint
 *         schema:
 *           type: integer
 *         description: Final sprint number for filtering
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     bySprint:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           sprintNumber:
 *                             type: integer
 *                           scrumMaster:
 *                             type: string
 *                           velocity:
 *                             type: number
 *                           efficiency:
 *                             type: number
 *                           completionRate:
 *                             type: number
 *                           bugResolutionRate:
 *                             type: number
 *                           startDate:
 *                             type: string
 *                             format: date-time
 *                           endDate:
 *                             type: string
 *                             format: date-time
 *                     overallStats:
 *                       type: object
 *                       properties:
 *                         totalSprints:
 *                           type: integer
 *                         averageDeliveredPoints:
 *                           type: number
 *                         averageEfficiency:
 *                           type: number
 *                         averageCompletionRate:
 *                           type: number
 *                         averageBugResolutionRate:
 *                           type: number
 *                         deliveryDistribution:
 *                           type: object
 *                           properties:
 *                             onTime:
 *                               type: integer
 *                             partial:
 *                               type: integer
 *                             late:
 *                               type: integer
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
async getScrumMasterStats(req: Request, res: Response) {
  try {
    const { initialSprint, finalSprint } = req.query;

    // Validate filters
    if ((initialSprint && !finalSprint) || (!initialSprint && finalSprint)) {
      return res.status(400).json({
        success: false,
        message: 'When providing a sprint filter, both initial and final must be specified'
      });
    }

    const filters = initialSprint && finalSprint ? {
      initialSprint: parseInt(initialSprint as string),
      finalSprint: parseInt(finalSprint as string)
    } : undefined;

    // Validate filter values
    if (filters && (isNaN(filters.initialSprint) || isNaN(filters.finalSprint))) {
      return res.status(400).json({
        success: false,
        message: 'Sprint numbers must be valid numeric values'
      });
    }

    if (filters && filters.finalSprint < filters.initialSprint) {
      return res.status(400).json({
        success: false,
        message: 'Final sprint number cannot be less than initial sprint number'
      });
    }

    const stats = await this.retrospectivaModel.obterEstatisticasScrumMaster(filters);
    
    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting Scrum Master statistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

  /**
 * @swagger
 * /retrospectives/team-member-stats:
 *   get:
 *     summary: Get team member retrospective statistics
 *     tags: [Retrospectives]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: initialSprint
 *         schema:
 *           type: integer
 *         description: Initial sprint number for filtering
 *       - in: query
 *         name: finalSprint
 *         schema:
 *           type: integer
 *         description: Final sprint number for filtering
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRetrospectives:
 *                       type: integer
 *                     bySprint:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           sprintNumber:
 *                             type: integer
 *                           averageProductivity:
 *                             type: number
 *                           averageTeamClimate:
 *                             type: number
 *                           averageCommunication:
 *                             type: number
 *                           averageObjectives:
 *                             type: number
 *                           averageBlockers:
 *                             type: number
 *                           totalResponses:
 *                             type: integer
 *                           members:
 *                             type: array
 *                             items:
 *                               type: string
 *                     roleDistribution:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
 *                     overallAverages:
 *                       type: object
 *                       properties:
 *                         productivity:
 *                           type: number
 *                         teamClimate:
 *                           type: number
 *                         communication:
 *                           type: number
 *                         objectives:
 *                           type: number
 *                         blockers:
 *                           type: number
 *                     byMember:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           role:
 *                             type: string
 *                           totalRetrospectives:
 *                             type: integer
 *                           averages:
 *                             type: object
 *                             properties:
 *                               productivity:
 *                                 type: number
 *                               teamClimate:
 *                                 type: number
 *                               communication:
 *                                 type: number
 *                               objectives:
 *                                 type: number
 *                               blockers:
 *                                 type: number
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
async getTeamMemberStats(req: Request, res: Response) {
  try {
    const { initialSprint, finalSprint } = req.query;

    // Validate filters
    if ((initialSprint && !finalSprint) || (!initialSprint && finalSprint)) {
      return res.status(400).json({
        success: false,
        message: 'When providing a sprint filter, both initial and final must be specified'
      });
    }

    const filters = initialSprint && finalSprint ? {
      initialSprint: parseInt(initialSprint as string),
      finalSprint: parseInt(finalSprint as string)
    } : undefined;

    if (filters && (isNaN(filters.initialSprint) || isNaN(filters.finalSprint))) {
      return res.status(400).json({
        success: false,
        message: 'Sprint numbers must be valid numeric values'
      });
    }

    if (filters && filters.finalSprint < filters.initialSprint) {
      return res.status(400).json({
        success: false,
        message: 'Final sprint number cannot be less than initial sprint number'
      });
    }

    // Get data from model
    const retrospectives = await prisma.retrospectivaTeamMember.findMany({
      where: filters ? {
        sprintNumber: {
          gte: filters.initialSprint,
          lte: filters.finalSprint
        }
      } : {},
      include: {
        usuario: true
      },
      orderBy: {
        sprintNumber: 'asc'
      }
    });

    // If no retrospectives, return empty
    if (retrospectives.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalRetrospectives: 0,
          bySprint: [],
          roleDistribution: {},
          overallAverages: {
            productivity: 0,
            teamClimate: 0,
            communication: 0,
            objectives: 0,
            blockers: 0
          },
          byMember: []
        }
      });
    }

    // Group by sprint using Map
    const sprintsMap = new Map<number, {
      sprintNumber: number;
      sumProductivity: number;
      sumTeamClimate: number;
      sumCommunication: number;
      sumObjectives: number;
      sumBlockers: number;
      totalResponses: number;
      members: Set<string>;
    }>();

    retrospectives.forEach(retro => {
      if (!sprintsMap.has(retro.sprintNumber)) {
        sprintsMap.set(retro.sprintNumber, {
          sprintNumber: retro.sprintNumber,
          sumProductivity: 0,
          sumTeamClimate: 0,
          sumCommunication: 0,
          sumObjectives: 0,
          sumBlockers: 0,
          totalResponses: 0,
          members: new Set()
        });
      }

      const sprint = sprintsMap.get(retro.sprintNumber)!;
      sprint.sumProductivity += retro.productivity;
      sprint.sumTeamClimate += retro.teamClimate;
      sprint.sumCommunication += retro.communication;
      sprint.sumObjectives += retro.objectives;
      sprint.sumBlockers += retro.blockers;
      sprint.totalResponses++;
      sprint.members.add(retro.usuario.nome);
    });

    // Convert to array and calculate averages
    const bySprint = Array.from(sprintsMap.values()).map(sprint => ({
      sprintNumber: sprint.sprintNumber,
      averageProductivity: parseFloat((sprint.sumProductivity / sprint.totalResponses).toFixed(2)),
      averageTeamClimate: parseFloat((sprint.sumTeamClimate / sprint.totalResponses).toFixed(2)),
      averageCommunication: parseFloat((sprint.sumCommunication / sprint.totalResponses).toFixed(2)),
      averageObjectives: parseFloat((sprint.sumObjectives / sprint.totalResponses).toFixed(2)),
      averageBlockers: parseFloat((sprint.sumBlockers / sprint.totalResponses).toFixed(2)),
      totalResponses: sprint.totalResponses,
      members: Array.from(sprint.members)
    }));

    // Sort by sprintNumber
    bySprint.sort((a, b) => a.sprintNumber - b.sprintNumber);

    // Role distribution
    const roleDistribution = retrospectives.reduce((acc: Record<string, number>, retro) => {
      acc[retro.role] = (acc[retro.role] || 0) + 1;
      return acc;
    }, {});

    // Overall averages
    const totalRetrospectives = retrospectives.length;
    const overallAverages = {
      productivity: parseFloat((retrospectives.reduce((sum, r) => sum + r.productivity, 0) / totalRetrospectives).toFixed(2)),
      teamClimate: parseFloat((retrospectives.reduce((sum, r) => sum + r.teamClimate, 0) / totalRetrospectives).toFixed(2)),
      communication: parseFloat((retrospectives.reduce((sum, r) => sum + r.communication, 0) / totalRetrospectives).toFixed(2)),
      objectives: parseFloat((retrospectives.reduce((sum, r) => sum + r.objectives, 0) / totalRetrospectives).toFixed(2)),
      blockers: parseFloat((retrospectives.reduce((sum, r) => sum + r.blockers, 0) / totalRetrospectives).toFixed(2))
    };

    // Statistics by member
    const membersMap = new Map<string, {
      name: string;
      role: string;
      totalRetrospectives: number;
      sumProductivity: number;
      sumTeamClimate: number;
      sumCommunication: number;
      sumObjectives: number;
      sumBlockers: number;
    }>();

    retrospectives.forEach(retro => {
      const memberName = retro.usuario.nome;
      if (!membersMap.has(memberName)) {
        membersMap.set(memberName, {
          name: memberName,
          role: retro.role,
          totalRetrospectives: 0,
          sumProductivity: 0,
          sumTeamClimate: 0,
          sumCommunication: 0,
          sumObjectives: 0,
          sumBlockers: 0
        });
      }

      const member = membersMap.get(memberName)!;
      member.totalRetrospectives++;
      member.sumProductivity += retro.productivity;
      member.sumTeamClimate += retro.teamClimate;
      member.sumCommunication += retro.communication;
      member.sumObjectives += retro.objectives;
      member.sumBlockers += retro.blockers;
    });

    // Calculate member averages
    const byMember = Array.from(membersMap.values()).map(member => ({
      name: member.name,
      role: member.role,
      totalRetrospectives: member.totalRetrospectives,
      averages: {
        productivity: parseFloat((member.sumProductivity / member.totalRetrospectives).toFixed(2)),
        teamClimate: parseFloat((member.sumTeamClimate / member.totalRetrospectives).toFixed(2)),
        communication: parseFloat((member.sumCommunication / member.totalRetrospectives).toFixed(2)),
        objectives: parseFloat((member.sumObjectives / member.totalRetrospectives).toFixed(2)),
        blockers: parseFloat((member.sumBlockers / member.totalRetrospectives).toFixed(2))
      }
    }));

    // Sort members by name
    byMember.sort((a, b) => a.name.localeCompare(b.name));

    // Prepare final response
    const response = {
      success: true,
      data: {
        totalRetrospectives,
        bySprint,
        roleDistribution,
        overallAverages,
        byMember
      }
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error getting team member statistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
  
} 