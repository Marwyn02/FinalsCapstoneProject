-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "loggedOut" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SpecialPrice" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Voucher" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
