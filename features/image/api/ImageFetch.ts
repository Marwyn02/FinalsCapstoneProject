"use server";

import prisma from "@/lib/db";

export async function ImageFetch() {
  const images = await prisma.image.findMany({
    include: {
      addedByAdmin: true,
      removedByAdmin: true,
    },
  });

  return images;
}

export async function ImageFetchClient() {
  const images = await prisma.image.findMany({
    where: {
      status: "confirmed",
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return images;
}

export async function ImagePendingfetch() {
  const images = await prisma.image.findMany({
    where: {
      status: "pending",
    },
  });

  return images;
}
