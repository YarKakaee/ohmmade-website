/*
  Warnings:

  - You are about to drop the column `previewImages` on the `Project` table. All the data in the column will be lost.
  - Added the required column `difficultyLevel` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "previewImages",
ADD COLUMN     "difficultyLevel" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT floor(random() * 90000000) + 10000000;
