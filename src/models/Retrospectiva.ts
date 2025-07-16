import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type RetrospectivaScrumMaster = Prisma.RetrospectivaScrumMasterGetPayload<{
  include: { usuario: true }
}>;

type RetrospectivaTeamMember = Prisma.RetrospectivaTeamMemberGetPayload<{
  include: { usuario: true }
}>;

type Usuario = Prisma.UsuarioGetPayload<{}>;

export class RetrospectivaModel {
  async criarRetrospectivaScrumMaster(dados: {
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
  }) {
    // Buscar ou criar usuário
    const usuario = await prisma.usuario.upsert({
      where: { nome: dados.nome },
      update: { papel: dados.papel },
      create: {
        nome: dados.nome,
        papel: dados.papel
      }
    });

    return prisma.retrospectivaScrumMaster.create({
      data: {
        usuarioId: usuario.id,
        sprintNumber: dados.sprintNumber,
        startDate: new Date(dados.startDate),
        endDate: new Date(dados.endDate),
        onTime: dados.onTime,
        plannedPoints: dados.plannedPoints,
        deliveredPoints: dados.deliveredPoints,
        totalTasks: dados.totalTasks,
        completedTasks: dados.completedTasks,
        pendingTasks: dados.pendingTasks,
        bugsFound: dados.bugsFound,
        bugsResolved: dados.bugsResolved,
        delivery: dados.delivery,
        observations: dados.observations,
        impediments: dados.impediments,
        improvements: dados.improvements,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        usuario: true
      }
    });
  }

  async criarRetrospectivaTeamMember(dados: {
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
  }) {
    // Primeiro tenta encontrar o usuário
    let usuario = await prisma.usuario.findFirst({
      where: {
        nome: dados.name
      }
    });

    // Se não encontrar, cria um novo
    if (!usuario) {
      usuario = await prisma.usuario.create({
        data: {
          nome: dados.name,
          papel: dados.role
        }
      });
    }

    const { name, ...dadosSemName } = dados;

    return prisma.retrospectivaTeamMember.create({
      data: {
        usuarioId: usuario.id,
        ...dadosSemName,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        usuario: true
      }
    });
  }

  async obterEstatisticasScrumMaster(filtros?: { initialSprint?: number; finalSprint?: number }) {
    const where: Prisma.RetrospectivaScrumMasterWhereInput = {};
    if (filtros?.initialSprint && filtros?.finalSprint) {
      where.sprintNumber = {
        gte: filtros.initialSprint,
        lte: filtros.finalSprint
      };
    }

    const retrospectivas = await prisma.retrospectivaScrumMaster.findMany({
      where,
      orderBy: {
        sprintNumber: 'asc'
      },
      include: {
        usuario: true
      }
    });

    const stats = {
      bySprint: retrospectivas.map((retro: RetrospectivaScrumMaster) => ({
        sprintNumber: retro.sprintNumber,
        scrumMaster: retro.usuario.nome,
        velocity: retro.deliveredPoints,
        efficiency: (retro.deliveredPoints / retro.plannedPoints) * 100,
        completionRate: (retro.completedTasks / retro.totalTasks) * 100,
        bugResolutionRate: (retro.bugsResolved / retro.bugsFound) * 100,
        startDate: retro.startDate,
        endDate: retro.endDate
      })),

      general: {
        totalSprints: retrospectivas.length,
        averageDeliveredPoints: 0,
        averageEfficiency: 0,
        averageCompletionRate: 0,
        averageBugResolutionRate: 0,
        deliveryDistribution: {
          onTime: retrospectivas.filter((r: RetrospectivaScrumMaster) => r.onTime === 'sim').length,
          partially: retrospectivas.filter((r: RetrospectivaScrumMaster) => r.onTime === 'parcialmente').length,
          late: retrospectivas.filter((r: RetrospectivaScrumMaster) => r.onTime === 'nao').length
        }
      }
    };

    if (retrospectivas.length > 0) {
      stats.general.averageDeliveredPoints = retrospectivas.reduce((acc: number, r: RetrospectivaScrumMaster) => acc + r.deliveredPoints, 0) / retrospectivas.length;
      stats.general.averageEfficiency = retrospectivas.reduce((acc: number, r: RetrospectivaScrumMaster) => acc + ((r.deliveredPoints / r.plannedPoints) * 100), 0) / retrospectivas.length;
      stats.general.averageCompletionRate = retrospectivas.reduce((acc: number, r: RetrospectivaScrumMaster) => acc + ((r.completedTasks / r.totalTasks) * 100), 0) / retrospectivas.length;
      stats.general.averageBugResolutionRate = retrospectivas.reduce((acc: number, r: RetrospectivaScrumMaster) => acc + ((r.bugsResolved / r.bugsFound) * 100), 0) / retrospectivas.length;
    }

    return stats;
  }

  async obterEstatisticasTeamMember(filtros?: { sprintInicial?: number; sprintFinal?: number }) {
    const where: Prisma.RetrospectivaTeamMemberWhereInput = {};
    if (filtros?.sprintInicial && filtros?.sprintFinal) {
      where.sprintNumber = {
        gte: filtros.sprintInicial,
        lte: filtros.sprintFinal
      };
    }

    const retrospectivas = await prisma.retrospectivaTeamMember.findMany({
      where,
      orderBy: {
        sprintNumber: 'asc'
      },
      include: {
        usuario: true
      }
    });

    type SprintStats = {
      sprintNumber: number;
      mediaProductividade: number;
      mediaClimaEquipe: number;
      mediaComunicacao: number;
      mediaObjetivos: number;
      mediaBloqueios: number;
      totalRespostas: number;
      membros: string[];
    };

    const estatisticas = {
      bySprint: retrospectivas.reduce((acc: Record<number, SprintStats>, retro: RetrospectivaTeamMember) => {
        if (!acc[retro.sprintNumber]) {
          acc[retro.sprintNumber] = {
            sprintNumber: retro.sprintNumber,
            mediaProductividade: 0,
            mediaClimaEquipe: 0,
            mediaComunicacao: 0,
            mediaObjetivos: 0,
            mediaBloqueios: 0,
            totalRespostas: 0,
            membros: []
          };
        }
        
        acc[retro.sprintNumber].mediaProductividade += retro.productivity;
        acc[retro.sprintNumber].mediaClimaEquipe += retro.teamClimate;
        acc[retro.sprintNumber].mediaComunicacao += retro.communication;
        acc[retro.sprintNumber].mediaObjetivos += retro.objectives;
        acc[retro.sprintNumber].mediaBloqueios += retro.blockers;
        acc[retro.sprintNumber].totalRespostas++;
        acc[retro.sprintNumber].membros.push(retro.usuario.nome);
        
        return acc;
      }, {}),

      roleDistribution: retrospectivas.reduce((acc: Record<string, number>, retro: RetrospectivaTeamMember) => {
        acc[retro.role] = (acc[retro.role] || 0) + 1;
        return acc;
      }, {}),

      general: {
        produtividade: 0,
        climaEquipe: 0,
        comunicacao: 0,
        objetivos: 0,
        bloqueios: 0
      }
    };

    // Calcular médias por sprint
    Object.values(estatisticas.bySprint).forEach((sprint: SprintStats) => {
      sprint.mediaProductividade /= sprint.totalRespostas;
      sprint.mediaClimaEquipe /= sprint.totalRespostas;
      sprint.mediaComunicacao /= sprint.totalRespostas;
      sprint.mediaObjetivos /= sprint.totalRespostas;
      sprint.mediaBloqueios /= sprint.totalRespostas;
    });

    // Calcular médias gerais
    if (retrospectivas.length > 0) {
      estatisticas.general = {
        produtividade: retrospectivas.reduce((acc: number, r: RetrospectivaTeamMember) => acc + r.productivity, 0) / retrospectivas.length,
        climaEquipe: retrospectivas.reduce((acc: number, r: RetrospectivaTeamMember) => acc + r.teamClimate, 0) / retrospectivas.length,
        comunicacao: retrospectivas.reduce((acc: number, r: RetrospectivaTeamMember) => acc + r.communication, 0) / retrospectivas.length,
        objetivos: retrospectivas.reduce((acc: number, r: RetrospectivaTeamMember) => acc + r.objectives, 0) / retrospectivas.length,
        bloqueios: retrospectivas.reduce((acc: number, r: RetrospectivaTeamMember) => acc + r.blockers, 0) / retrospectivas.length
      };
    }

    return estatisticas;
  }

  async obterEstatisticasPorMembro(filtros?: { sprintInicial?: number; sprintFinal?: number }) {
    const where: Prisma.RetrospectivaTeamMemberWhereInput = {};
    if (filtros?.sprintInicial && filtros?.sprintFinal) {
      where.sprintNumber = {
        gte: filtros.sprintInicial,
        lte: filtros.sprintFinal
      };
    }
  
    const retrospectivas = await prisma.retrospectivaTeamMember.findMany({
      where,
      include: {
        usuario: true
      }
    });
  
    // Agrupar por membro
    const membrosMap = new Map<string, {
      nome: string;
      role: string;
      totalRetrospectivas: number;
      somaProductivity: number;
      somaTeamClimate: number;
      somaCommunication: number;
      somaObjectives: number;
      somaBlockers: number;
    }>();
  
    retrospectivas.forEach(retro => {
      const nomeMembro = retro.usuario.nome;
      if (!membrosMap.has(nomeMembro)) {
        membrosMap.set(nomeMembro, {
          nome: nomeMembro,
          role: retro.role,
          totalRetrospectivas: 0,
          somaProductivity: 0,
          somaTeamClimate: 0,
          somaCommunication: 0,
          somaObjectives: 0,
          somaBlockers: 0
        });
      }
  
      const membro = membrosMap.get(nomeMembro)!;
      membro.totalRetrospectivas++;
      membro.somaProductivity += retro.productivity;
      membro.somaTeamClimate += retro.teamClimate;
      membro.somaCommunication += retro.communication;
      membro.somaObjectives += retro.objectives;
      membro.somaBlockers += retro.blockers;
    });
  
    // Calcular médias por membro
    const estatisticasPorMembro = Array.from(membrosMap.values()).map(membro => ({
      nome: membro.nome,
      role: membro.role,
      totalRetrospectivas: membro.totalRetrospectivas,
      medias: {
        productivity: membro.somaProductivity / membro.totalRetrospectivas,
        teamClimate: membro.somaTeamClimate / membro.totalRetrospectivas,
        communication: membro.somaCommunication / membro.totalRetrospectivas,
        objectives: membro.somaObjectives / membro.totalRetrospectivas,
        blockers: membro.somaBlockers / membro.totalRetrospectivas
      }
    }));
  
    return estatisticasPorMembro;
  }
} 