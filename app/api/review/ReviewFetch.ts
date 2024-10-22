"use server";

import prisma from "@/lib/db";

export async function ReviewFetch(reviewId: string) {
  try {
    if (reviewId !== "") {
      const review = await prisma.review.findFirst({
        where: {
          reviewId,
        },
      });

      return review;
    }
  } catch (error) {
    console.error("Error in finding the review: ", error);
    return { success: false, message: error };
  }
}

export async function ReviewFetchAll() {
  const reviews = await prisma.review.findMany();

  return reviews;
}
