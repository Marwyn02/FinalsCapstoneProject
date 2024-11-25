/*
  Warnings:

  - Made the column `loggedIn` on table `Admin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `Admin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `downpayment` on table `Reservation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Reply" DROP CONSTRAINT "Reply_adminId_fkey";

-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "loggedIn" SET NOT NULL,
ALTER COLUMN "role" SET NOT NULL;

-- AlterTable
ALTER TABLE "Reply" ALTER COLUMN "adminId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "downpayment" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("adminId") ON DELETE RESTRICT ON UPDATE CASCADE;
