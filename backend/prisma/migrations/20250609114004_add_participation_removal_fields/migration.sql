-- AlterTable
ALTER TABLE "Participation" ADD COLUMN     "removalReason" TEXT,
ADD COLUMN     "removalRequestedById" INTEGER,
ADD COLUMN     "removalStatus" VARCHAR(20) NOT NULL DEFAULT 'NONE',
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" INTEGER;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_removalRequestedById_fkey" FOREIGN KEY ("removalRequestedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
