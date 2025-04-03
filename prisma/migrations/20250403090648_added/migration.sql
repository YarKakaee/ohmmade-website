/*
  Warnings:

  - You are about to drop the column `author` on the `Project` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "author",
ADD COLUMN     "authorId" UUID NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'draft',
ALTER COLUMN "id" SET DEFAULT floor(random() * 90000000) + 10000000;

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
