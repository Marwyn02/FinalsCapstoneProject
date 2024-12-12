"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
// import { AuditLog } from "@/features/audit/api/AuditLog";

type ReplyType = {
  id?: number;
  replyId: string;
  message: string;
  author: string;
  reviewId: string;
  adminId?: string;
  updatedAt?: Date;
  createdAt?: Date;
};

export async function CreateReply(values: ReplyType) {
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
    const values = {
      adminId,
      username: author,
      resourceType: "Reply ID",
      resourceId: res.replyId,
      details: {
        updateReply: {
          from: `From: ${res.message}`,
          to: `To: ${message}`,
        },
      },
    };

    // await AuditLog("Update Reply", values);

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

  // const values1 = {
  //   adminId,
  //   username: author,
  //   resourceType: "Reply ID",
  //   resourceId: replyId,
  //   details: {
  //     createReply: { reply: `Add: ${message}` },
  //   },
  // };

  // await AuditLog("Create Reply", values1);

  revalidatePath("/admin-dashboard/reviews");
}
