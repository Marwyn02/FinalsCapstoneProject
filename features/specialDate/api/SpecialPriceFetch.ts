"use server";

import prisma from "@/lib/db";

export async function SpecialPriceFetch() {
  const specialPrices = await prisma.specialPrice.findMany({
    where: {
      isActive: true,
      isDeleted: false,
    },
  });

  return specialPrices;
}

export async function SpecialPriceFetchArchivedInAdmin() {
  const today = new Date();

  const spe = await prisma.specialPrice.findFirst({
    where: {
      date: {
        lt: today,
      },
      isActive: true,
    },
  });

  if (spe) {
    await prisma.specialPrice.update({
      where: {
        id: spe.id,
      },
      data: {
        isActive: false,
      },
    });
  }

  const specialDate = await prisma.specialPrice.findMany({
    where: {
      OR: [{ isDeleted: true }, { isActive: false }],
    },
    include: {
      removedByAdmin: true,
    },
  });

  return specialDate;
}
