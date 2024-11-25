/*
  Warnings:

  - You are about to drop the column `adminId` on the `Reply` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Reply` table. All the data in the column will be lost.
  - You are about to drop the column `reviewId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `replyId` on the `Review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[removedBy]` on the table `Subsriber` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Reply" DROP CONSTRAINT "Reply_adminId_fkey";

-- DropIndex
DROP INDEX "Reservation_reviewId_key";

-- DropIndex
DROP INDEX "Review_replyId_key";

-- AlterTable
ALTER TABLE "Reply" DROP COLUMN "adminId",
DROP COLUMN "updatedAt",
ADD COLUMN     "addedBy" TEXT,
ADD COLUMN     "removalMessage" TEXT,
ADD COLUMN     "removedBy" TEXT;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "reviewId",
ADD COLUMN     "removedBy" TEXT;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "replyId",
ADD COLUMN     "addedBy" TEXT,
ADD COLUMN     "removalMessage" TEXT,
ADD COLUMN     "removedBy" TEXT;

-- AlterTable
ALTER TABLE "SpecialPrice" ADD COLUMN     "addedBy" TEXT,
ADD COLUMN     "removedBy" TEXT;

-- AlterTable
ALTER TABLE "Subsriber" ADD COLUMN     "removedBy" TEXT;

-- AlterTable
ALTER TABLE "Voucher" ADD COLUMN     "addedBy" TEXT,
ADD COLUMN     "removedBy" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Subsriber_removedBy_key" ON "Subsriber"("removedBy");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_removedBy_fkey" FOREIGN KEY ("removedBy") REFERENCES "Admin"("adminId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "Admin"("adminId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_removedBy_fkey" FOREIGN KEY ("removedBy") REFERENCES "Admin"("adminId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "Admin"("adminId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_removedBy_fkey" FOREIGN KEY ("removedBy") REFERENCES "Admin"("adminId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialPrice" ADD CONSTRAINT "SpecialPrice_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "Admin"("adminId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialPrice" ADD CONSTRAINT "SpecialPrice_removedBy_fkey" FOREIGN KEY ("removedBy") REFERENCES "Admin"("adminId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "Admin"("adminId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_removedBy_fkey" FOREIGN KEY ("removedBy") REFERENCES "Admin"("adminId") ON DELETE SET NULL ON UPDATE CASCADE;
