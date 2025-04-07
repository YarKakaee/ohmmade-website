-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "status" SET DEFAULT 'published',
ALTER COLUMN "id" SET DEFAULT floor(random() * 90000000) + 10000000;
