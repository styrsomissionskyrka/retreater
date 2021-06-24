/*
  Warnings:

  - You are about to drop the column `registrationFee` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `registrationFee` on the `Retreat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Order` DROP COLUMN `registrationFee`;

-- AlterTable
ALTER TABLE `Retreat` DROP COLUMN `registrationFee`;
