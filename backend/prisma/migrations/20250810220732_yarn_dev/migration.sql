/*
  Warnings:

  - You are about to drop the column `isPublic` on the `Email` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Email" DROP COLUMN "isPublic",
ADD COLUMN     "isSeen" BOOLEAN NOT NULL DEFAULT false;
