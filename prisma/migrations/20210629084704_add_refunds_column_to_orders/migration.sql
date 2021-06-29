-- AlterTable
ALTER TABLE `Order` ADD COLUMN `refunds` JSON,
    MODIFY `checkoutSessions` JSON;
