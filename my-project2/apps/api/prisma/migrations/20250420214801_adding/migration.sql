-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ALUMNI', 'STUDENT', 'USER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
