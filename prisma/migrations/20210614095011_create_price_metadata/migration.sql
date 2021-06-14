-- CreateTable
CREATE TABLE `PriceMetadata` (
    `id` VARCHAR(191) NOT NULL,
    `priceId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `description` VARCHAR(191),

    UNIQUE INDEX `PriceMetadata.priceId_unique`(`priceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
