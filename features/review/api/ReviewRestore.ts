"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function ReviewRestore(reviewId: string) {
  const review = await prisma.review.findUnique({
    where: {
      reviewId,
      isDeleted: true,
    },
    include: {
      reply: true,
    },
  });

  if (review?.reply) {
    await prisma.reply.update({
      where: {
        replyId: review.reply.replyId,
      },
      data: { removedBy: null, isDeleted: false, deletedAt: null },
    });
  }

  await prisma.review.update({
    where: {
      reviewId,
    },
    data: {
      removedBy: null,
      isDeleted: false,
      status: "confirmed",
      deletedAt: null,
    },
  });

  revalidatePath("/admin-dashboard/reviews");
}
