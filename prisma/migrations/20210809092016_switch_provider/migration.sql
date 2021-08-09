-- CreateEnum
CREATE TYPE "RetreatStatus" AS ENUM ('PUBLISHED', 'DRAFT', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('CREATED', 'PENDING', 'PARTIALLY_CONFIRMED', 'CONFIRMED', 'DECLINED', 'CANCELLED', 'ERRORED');

-- CreateTable
CREATE TABLE "Retreat" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "products" TEXT[],
    "status" "RetreatStatus" NOT NULL DEFAULT E'DRAFT',
    "title" VARCHAR(255) NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "maxParticipants" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "retreatId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT E'CREATED',
    "price" TEXT NOT NULL,
    "coupon" TEXT,
    "checkoutSessions" TEXT[],
    "refunds" TEXT[],
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "errorReason" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderMetadata" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Retreat.slug_unique" ON "Retreat"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "OrderMetadata_orderId_unique" ON "OrderMetadata"("orderId");

-- AddForeignKey
ALTER TABLE "Order" ADD FOREIGN KEY ("retreatId") REFERENCES "Retreat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderMetadata" ADD FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
