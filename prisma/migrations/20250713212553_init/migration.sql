-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "papel" TEXT NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sprints" (
    "id" UUID NOT NULL,
    "numero" INTEGER NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3) NOT NULL,
    "encerramento_status" TEXT NOT NULL,

    CONSTRAINT "sprints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes_pessoais" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "id_sprint" UUID NOT NULL,
    "produtividade" INTEGER NOT NULL,
    "clima_equipe" INTEGER NOT NULL,
    "comunicacao" INTEGER NOT NULL,
    "objetivos_claros" INTEGER NOT NULL,
    "teve_bloqueios" INTEGER NOT NULL,
    "o_que_funcionou" TEXT NOT NULL,
    "o_que_nao_funcionou" TEXT NOT NULL,
    "sugestoes_proxima_sprint" TEXT NOT NULL,
    "comentarios_adicionais" TEXT,

    CONSTRAINT "avaliacoes_pessoais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes_scrum_master" (
    "id" UUID NOT NULL,
    "id_sprint" UUID NOT NULL,
    "pontos_planejados" INTEGER NOT NULL,
    "pontos_entregues" INTEGER NOT NULL,
    "tarefas_planejadas" INTEGER NOT NULL,
    "tarefas_concluidas" INTEGER NOT NULL,
    "tarefas_pendentes" INTEGER NOT NULL,
    "bugs_identificados" INTEGER NOT NULL,
    "bugs_resolvidos" INTEGER NOT NULL,
    "houve_entrega" TEXT NOT NULL,
    "observacoes_gerais" TEXT NOT NULL,
    "principais_impedimentos" TEXT NOT NULL,
    "melhorias_implementadas" TEXT NOT NULL,

    CONSTRAINT "avaliacoes_scrum_master_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_scrum_master_id_sprint_key" ON "avaliacoes_scrum_master"("id_sprint");

-- AddForeignKey
ALTER TABLE "avaliacoes_pessoais" ADD CONSTRAINT "avaliacoes_pessoais_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes_pessoais" ADD CONSTRAINT "avaliacoes_pessoais_id_sprint_fkey" FOREIGN KEY ("id_sprint") REFERENCES "sprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes_scrum_master" ADD CONSTRAINT "avaliacoes_scrum_master_id_sprint_fkey" FOREIGN KEY ("id_sprint") REFERENCES "sprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
