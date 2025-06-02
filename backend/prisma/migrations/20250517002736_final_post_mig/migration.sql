/*
  Warnings:

  - The values [CLUB_EVENT,CLUB_RECRUITMENT,STUDENT_INTERVIEW,INTERNSHIP_OFFER] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.
  - The values [ANNOUNCEMENT,POLL,SUGGESTION_BOX] on the enum `PostType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('CONFERENCE', 'WORKSHOP', 'HACKATHON_ALERT');
ALTER TABLE "Post" ALTER COLUMN "eventType" TYPE "EventType_new" USING ("eventType"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "EventType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PostType_new" AS ENUM ('GENERAL', 'EVENT', 'FORMATION', 'COURSE_MATERIAL', 'REVISION_EXERCISE');
ALTER TABLE "Post" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Post" ALTER COLUMN "type" TYPE "PostType_new" USING ("type"::text::"PostType_new");
ALTER TYPE "PostType" RENAME TO "PostType_old";
ALTER TYPE "PostType_new" RENAME TO "PostType";
DROP TYPE "PostType_old";
ALTER TABLE "Post" ALTER COLUMN "type" SET DEFAULT 'GENERAL';
COMMIT;
