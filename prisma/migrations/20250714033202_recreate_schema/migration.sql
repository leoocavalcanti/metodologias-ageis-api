/*
  Warnings:

  - You are about to drop the column `name` on the `retrospectivas_team_member` table. All the data in the column will be lost.
  - You are about to drop the `avaliacoes_pessoais` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `avaliacoes_scrum_master` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sprints` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nome]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usuario_id` to the `retrospectivas_scrum_master` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario_id` to the `retrospectivas_team_member` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "avaliacoes_pessoais" DROP CONSTRAINT "avaliacoes_pessoais_id_sprint_fkey";

-- DropForeignKey
ALTER TABLE "avaliacoes_pessoais" DROP CONSTRAINT "avaliacoes_pessoais_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "avaliacoes_scrum_master" DROP CONSTRAINT "avaliacoes_scrum_master_id_sprint_fkey";

-- AlterTable
ALTER TABLE "retrospectivas_scrum_master" ADD COLUMN     "usuario_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "retrospectivas_team_member" DROP COLUMN "name",
ADD COLUMN     "usuario_id" UUID NOT NULL;

-- DropTable
DROP TABLE "avaliacoes_pessoais";

-- DropTable
DROP TABLE "avaliacoes_scrum_master";

-- DropTable
DROP TABLE "sprints";

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_nome_key" ON "usuarios"("nome");

-- AddForeignKey
ALTER TABLE "retrospectivas_scrum_master" ADD CONSTRAINT "retrospectivas_scrum_master_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retrospectivas_team_member" ADD CONSTRAINT "retrospectivas_team_member_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
