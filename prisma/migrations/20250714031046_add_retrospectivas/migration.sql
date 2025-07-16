-- CreateTable
CREATE TABLE "retrospectivas_scrum_master" (
    "id" TEXT NOT NULL,
    "sprintNumber" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "onTime" TEXT NOT NULL,
    "plannedPoints" INTEGER NOT NULL,
    "deliveredPoints" INTEGER NOT NULL,
    "totalTasks" INTEGER NOT NULL,
    "completedTasks" INTEGER NOT NULL,
    "pendingTasks" INTEGER NOT NULL,
    "bugsFound" INTEGER NOT NULL,
    "bugsResolved" INTEGER NOT NULL,
    "delivery" TEXT NOT NULL,
    "observations" TEXT NOT NULL,
    "impediments" TEXT NOT NULL,
    "improvements" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "retrospectivas_scrum_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retrospectivas_team_member" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "otherRole" TEXT,
    "sprintNumber" INTEGER NOT NULL,
    "productivity" INTEGER NOT NULL,
    "teamClimate" INTEGER NOT NULL,
    "communication" INTEGER NOT NULL,
    "objectives" INTEGER NOT NULL,
    "blockers" INTEGER NOT NULL,
    "whatWorked" TEXT NOT NULL,
    "whatDidntWork" TEXT NOT NULL,
    "suggestions" TEXT NOT NULL,
    "additionalComments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "retrospectivas_team_member_pkey" PRIMARY KEY ("id")
);
