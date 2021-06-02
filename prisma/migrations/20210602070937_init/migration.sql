-- CreateTable
CREATE TABLE `Retreat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191),
    `startDate` DATETIME(3),
    `endDate` DATETIME(3),
    `maxParticipants` INTEGER NOT NULL DEFAULT 0,
    `totalParticipants` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Retreat.slug_unique`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191),

    UNIQUE INDEX `User.email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Retreat` ADD FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
