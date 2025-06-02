-- AlterTable
ALTER TABLE "user" ADD COLUMN     "resetCode" VARCHAR(6),
ADD COLUMN     "resetCodeExpiry" TIMESTAMP(3);
