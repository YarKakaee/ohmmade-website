/*
  Warnings:

  - You are about to drop the column `website` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "id" SET DEFAULT floor(random() * 90000000) + 10000000;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "website";
