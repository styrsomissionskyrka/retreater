-- CreateTable
CREATE TABLE `Retreat` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `products` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `content` VARCHAR(191),
    `startDate` DATETIME(3),
    `endDate` DATETIME(3),
    `maxParticipants` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Retreat.slug_unique`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
