/*
  Warnings:

  - You are about to alter the column `status` on the `Retreat` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum("Retreat_status")`.

*/
-- AlterTable
ALTER TABLE `Retreat` MODIFY `status` ENUM('PUBLISHED', 'DRAFT', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT';
