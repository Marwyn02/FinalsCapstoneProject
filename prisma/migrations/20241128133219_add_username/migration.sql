/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Audit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `Audit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Audit" ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Audit_username_key" ON "Audit"("username");
