"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function RestoreReply(replyId: string) {
  await prisma.reply.update({
    where: {
      replyId,
      isDeleted: true,
    },
    data: { removedBy: null, isDeleted: false, deletedAt: null },
  });

  revalidatePath("/admin-dashboard/reviews");
}
