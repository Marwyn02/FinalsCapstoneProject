"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function ReviewDelete(reviewId: string, adminId: string) {
  const review = await prisma.review.findUnique({
    where: {
      reviewId,
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
      data: { removedBy: adminId, isDeleted: true, deletedAt: new Date() },
    });
  }

  await prisma.review.update({
    where: {
      reviewId,
    },
    data: { removedBy: adminId, isDeleted: true, deletedAt: new Date() },
  });

  revalidatePath("/admin-dashboard/reviews");
}
