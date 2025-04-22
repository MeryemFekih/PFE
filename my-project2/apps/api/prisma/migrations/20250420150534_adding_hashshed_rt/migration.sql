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

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
