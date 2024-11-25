/*
  Warnings:

  - A unique constraint covering the columns `[month,year]` on the table `Profit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Profit_month_year_key" ON "Profit"("month", "year");
