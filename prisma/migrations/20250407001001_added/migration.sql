-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "componentsUsed" TEXT[],
ALTER COLUMN "id" SET DEFAULT floor(random() * 90000000) + 10000000;
