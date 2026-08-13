/*
  Warnings:

  - You are about to drop the column `ciudad` on the `Ayuda` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ayuda" DROP COLUMN "ciudad",
ADD COLUMN     "municipio" TEXT NOT NULL DEFAULT 'Quibdó';
