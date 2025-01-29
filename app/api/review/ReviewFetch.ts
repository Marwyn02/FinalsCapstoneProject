"use server";

import prisma from "@/lib/db";

export async function ReviewFetch(reviewId: string) {
  if (reviewId !== "") {
    const review = await prisma.review.findFirst({
      where: {
        reviewId,
        isDeleted: false,
      },
    });

    return review;
  }
}

export async function ReviewFetchPending() {
  const reviews = await prisma.review.findMany({
    where: {
      status: "pending",
      isDeleted: false,
    },
    include: {
      addedByAdmin: true,
      removedByAdmin: true,
    },
  });

  return reviews;
}

export async function ReviewFetchAll() {
  const reviews = await prisma.review.findMany({
    where: {
      status: "confirmed",
      isDeleted: false,
    },
  });

  return reviews;
}

// Fetch all reviews that is confirmed
export async function ReviewFetchInAdmin() {
  const reviews = await prisma.review.findMany({
    where: {
      status: "confirmed",
      isDeleted: false,
    },
    include: {
      addedByAdmin: true,
      removedByAdmin: true,
      reply: {
        include: {
          removedByAdmin: true,
          addedByAdmin: true,
        },
      },
    },
  });

  return reviews;
}

export async function ReviewFetchArchive() {
  const reviews = await prisma.review.findMany({
    where: {
      OR: [{ isDeleted: true }, { status: "canceled" }],
    },
    include: {
      addedByAdmin: true,
      removedByAdmin: true,
      reply: {
        include: {
          removedByAdmin: true,
          addedByAdmin: true,
        },
      },
    },
  });

  return reviews;
}
