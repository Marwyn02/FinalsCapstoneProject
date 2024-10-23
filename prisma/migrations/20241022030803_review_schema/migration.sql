/*
  Warnings:

  - A unique constraint covering the columns `[reservationId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "reviewId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "staff" TEXT NOT NULL,
    "valueForMoney" TEXT NOT NULL,
    "facilities" TEXT NOT NULL,
    "cleanliness" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "comfort" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_reviewId_key" ON "Review"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_reservationId_key" ON "Reservation"("reservationId");
