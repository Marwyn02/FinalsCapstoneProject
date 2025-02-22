/*
  Warnings:

  - A unique constraint covering the columns `[reviewId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reservationId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reservationId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "reviewId" TEXT;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "reservationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_reviewId_key" ON "Reservation"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_reservationId_key" ON "Review"("reservationId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("reservationId") ON DELETE RESTRICT ON UPDATE CASCADE;
