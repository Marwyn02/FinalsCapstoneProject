-- AlterTable
ALTER TABLE "Audit" ALTER COLUMN "resourceType" DROP NOT NULL,
ALTER COLUMN "resourceId" DROP NOT NULL;
