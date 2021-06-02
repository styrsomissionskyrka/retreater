/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Retreat` DROP FOREIGN KEY `Retreat_ibfk_1`;

-- AlterTable
ALTER TABLE `Retreat` MODIFY `createdById` VARCHAR(191);

-- DropTable
DROP TABLE `User`;
