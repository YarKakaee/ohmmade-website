-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "id" SET DEFAULT floor(random() * 90000000) + 10000000;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "twitter" TEXT,
ADD COLUMN     "website" TEXT;
