/*
  Warnings:

  - You are about to drop the column `roomId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modeOfPayment` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prefix` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reservationId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_userId_fkey";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "roomId",
DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "modeOfPayment" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "prefix" TEXT NOT NULL,
ADD COLUMN     "reservationId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Room";

-- DropTable
DROP TABLE "User";
