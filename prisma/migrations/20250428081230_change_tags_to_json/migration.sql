/*
  Warnings:

  - Changed the type of `tags` on the `Project` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "tags",
ADD COLUMN     "tags" JSONB NOT NULL,
ALTER COLUMN "id" SET DEFAULT floor(random() * 90000000) + 10000000;
