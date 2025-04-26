-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ALUMNI', 'STUDENT', 'USER');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('SCHOOL', 'FORMATION', 'MEETING', 'PERSONAL', 'OTHER');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "hashedRefreshToken" TEXT,
    "phone" VARCHAR(25),
    "birthdate" DATE NOT NULL,
    "gender" VARCHAR(20) NOT NULL,
    "university" VARCHAR(150),
    "userType" VARCHAR(20),
    "formation" VARCHAR(100),
    "graduationYear" DATE,
    "degree" VARCHAR(100),
    "occupation" VARCHAR(100),
    "subject" VARCHAR(100),
    "rank" VARCHAR(100),
    "interests" VARCHAR(100)[],
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "reminderAt" TIMESTAMP(3),
    "priority" "Priority" NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "category" "EventCategory" NOT NULL,
    "reminderAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
