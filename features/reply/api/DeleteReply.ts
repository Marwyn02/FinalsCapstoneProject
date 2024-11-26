"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function DeleteReply(replyId: string, adminId: string) {
  if (replyId && adminId) {
    await prisma.reply.update({
      where: {
        replyId,
      },
      data: { removedBy: adminId, isDeleted: true, deletedAt: new Date() },
    });
  }

  revalidatePath("/admin-dashboard/reviews");
}
