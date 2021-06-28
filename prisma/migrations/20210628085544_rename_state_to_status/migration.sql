/*
  Warnings:

  - You are about to drop the column `state` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Order` DROP COLUMN `state`,
    ADD COLUMN `status` ENUM('CREATED', 'PENDING', 'PARTIALLY_CONFIRMED', 'CONFIRMED', 'DECLINED', 'CANCELLED', 'ERRORED') NOT NULL DEFAULT 'CREATED';
