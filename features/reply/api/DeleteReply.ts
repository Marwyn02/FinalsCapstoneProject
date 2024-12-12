"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
// import { AuditLog } from "@/features/audit/api/AuditLog";

export async function DeleteReply(
  replyId: string,
  adminId: string
  // username: string
) {
  if (replyId && adminId) {
    await prisma.reply.update({
      where: {
        replyId,
      },
      data: { removedBy: adminId, isDeleted: true, deletedAt: new Date() },
    });
  }

  // const values = {
  //   username,
  //   adminId,
  //   resourceType: "Reply ID",
  //   resourceId: replyId,
  // };

  // await AuditLog("Delete Reply", values);

  revalidatePath("/admin-dashboard/reviews");
}
