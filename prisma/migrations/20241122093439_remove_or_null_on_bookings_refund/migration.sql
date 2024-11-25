/*
  Warnings:

  - Made the column `bookings` on table `Profit` required. This step will fail if there are existing NULL values in that column.
  - Made the column `refund` on table `Profit` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profit" ALTER COLUMN "bookings" SET NOT NULL,
ALTER COLUMN "refund" SET NOT NULL;
