-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE';
