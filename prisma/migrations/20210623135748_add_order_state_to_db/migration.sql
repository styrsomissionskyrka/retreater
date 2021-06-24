/*
  Warnings:

  - You are about to drop the column `serializedState` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Order` DROP COLUMN `serializedState`,
    ADD COLUMN `state` ENUM('CREATED', 'PENDING', 'PARTIALLY_CONFIRMED', 'CONFIRMED', 'DECLINED', 'CANCELLED') NOT NULL DEFAULT 'CREATED';
