"use server";

import prisma from "@/lib/db";
import { Reply } from "@/app/lib/types/types";
import { revalidatePath } from "next/cache";

export async function CreateReply(values: Reply) {
  const { replyId, message, author, reviewId, adminId } = values;

  if (!message || !author || !reviewId || !adminId) {
    throw new Error(
      "Missing required fields: message, author, reviewId, or adminId."
    );
  }

  const res = await prisma.reply.findUnique({
    where: {
      reviewId,
    },
  });

  // If this is true, then the process is in update state
  if (res) {
    await prisma.reply.update({
      where: {
        replyId: res.replyId,
      },
      data: {
        message,
        author,
        addedBy: adminId,
      },
    });

    revalidatePath("/admin-dashboard/reviews");
    return;
  }

  await prisma.reply.create({
    data: {
      replyId,
      message,
      author,
      reviewId,
      addedBy: adminId,
    },
  });

  revalidatePath("/admin-dashboard/reviews");
}
