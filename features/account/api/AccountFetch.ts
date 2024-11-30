"use server";

import prisma from "@/lib/db";

export async function AccountFetchAll() {
  const admins = await prisma.admin.findMany({
    where: {
      isDeleted: false,
    },
  });

  return admins;
}

export async function AccountFetchAllForAdmin() {
  const admins = await prisma.admin.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      removedReplies: true,
      removedReservation: true,
      removedReviews: true,
      removedSpecialPrices: true,
      removedVouchers: true,
      addedReplies: true,
      addedReviews: true,
      addedSpecialPrices: true,
      addedVouchers: true,
    },
  });

  return admins;
}

export async function AccountFetchArchive() {
  const admins = await prisma.admin.findMany({
    where: {
      isDeleted: true,
    },
  });

  return admins;
}
