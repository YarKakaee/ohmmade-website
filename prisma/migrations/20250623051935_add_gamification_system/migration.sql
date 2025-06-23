-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "id" SET DEFAULT floor(random() * 90000000) + 10000000;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastWattsUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "level" TEXT NOT NULL DEFAULT 'Newbie',
ADD COLUMN     "nextLevelWatts" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "watts" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "WattsLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "watts" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WattsLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WattsLog_userId_createdAt_idx" ON "WattsLog"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "WattsLog" ADD CONSTRAINT "WattsLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
