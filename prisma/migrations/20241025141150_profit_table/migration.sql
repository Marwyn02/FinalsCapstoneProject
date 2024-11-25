-- CreateTable
CREATE TABLE "Profit" (
    "id" SERIAL NOT NULL,
    "profitId" TEXT NOT NULL,
    "profit" INTEGER NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "year" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profit_profitId_key" ON "Profit"("profitId");
