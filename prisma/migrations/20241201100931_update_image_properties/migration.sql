/*
  Warnings:

  - Added the required column `fileName` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "addedBy" TEXT,
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "publicId" TEXT NOT NULL,
ADD COLUMN     "removedBy" TEXT;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "Admin"("adminId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_removedBy_fkey" FOREIGN KEY ("removedBy") REFERENCES "Admin"("adminId") ON DELETE SET NULL ON UPDATE CASCADE;
