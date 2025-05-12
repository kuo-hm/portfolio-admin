-- CreateEnum
CREATE TYPE "Language" AS ENUM ('en', 'ar', 'fr', 'es', 'de', 'it', 'ja', 'zh', 'hi');

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "language" "Language" NOT NULL DEFAULT 'en';
