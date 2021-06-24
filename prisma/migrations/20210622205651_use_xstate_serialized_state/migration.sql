/*
  Warnings:

  - You are about to drop the column `state` on the `Order` table. All the data in the column will be lost.
  - Added the required column `serializedState` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` DROP COLUMN `state`,
    ADD COLUMN `serializedState` VARCHAR(191) NOT NULL;
