-- CreateEnum
CREATE TYPE "LogItemType" AS ENUM ('RETREAT', 'ORDER');

-- CreateTable
CREATE TABLE "LogItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "itemType" "LogItemType" NOT NULL,
    "itemId" TEXT NOT NULL,
    "userId" TEXT,
    "event" TEXT NOT NULL,

    PRIMARY KEY ("id")
);
