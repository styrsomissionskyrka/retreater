/*
  Warnings:

  - The primary key for the `Retreat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Retreat` DROP FOREIGN KEY `Retreat_ibfk_1`;

-- AlterTable
ALTER TABLE `Retreat` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `createdById` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Retreat` ADD FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
