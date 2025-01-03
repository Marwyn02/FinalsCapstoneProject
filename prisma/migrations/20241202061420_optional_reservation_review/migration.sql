-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_reservationId_fkey";

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "reservationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("reservationId") ON DELETE SET NULL ON UPDATE CASCADE;
