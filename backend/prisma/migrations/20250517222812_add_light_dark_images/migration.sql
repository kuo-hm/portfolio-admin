/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Skill` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "imageUrl",
ADD COLUMN     "darkImageUrl" TEXT,
ADD COLUMN     "lightImageUrl" TEXT;
