/*
  Warnings:

  - The values [PENDING] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `resetCode` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `resetCodeExpiry` on the `user` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('GENERAL', 'EVENT', 'FORMATION', 'COURSE_MATERIAL', 'REVISION_EXERCISE', 'ANNOUNCEMENT', 'POLL', 'SUGGESTION_BOX');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CONFERENCE', 'WORKSHOP', 'CLUB_EVENT', 'CLUB_RECRUITMENT', 'STUDENT_INTERVIEW', 'INTERNSHIP_OFFER', 'HACKATHON_ALERT');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'ALUMNI', 'PROFESSOR', 'STUDENT', 'PUBLIC');
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'PUBLIC';
COMMIT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "eventType" "EventType",
ADD COLUMN     "location" TEXT,
ADD COLUMN     "speakerId" INTEGER,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "subject" VARCHAR(100),
ADD COLUMN     "type" "PostType" NOT NULL DEFAULT 'GENERAL';

-- AlterTable
ALTER TABLE "user" DROP COLUMN "resetCode",
DROP COLUMN "resetCodeExpiry",
ALTER COLUMN "role" SET DEFAULT 'PUBLIC';

-- CreateTable
CREATE TABLE "Participation" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "motivation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Post_type_idx" ON "Post"("type");

-- CreateIndex
CREATE INDEX "Post_status_idx" ON "Post"("status");

-- CreateIndex
CREATE INDEX "Post_subject_idx" ON "Post"("subject");

-- CreateIndex
CREATE INDEX "Post_eventType_idx" ON "Post"("eventType");

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
