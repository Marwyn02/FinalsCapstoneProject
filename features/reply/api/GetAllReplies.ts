"use server";

import prisma from "@/lib/db";

export async function GetAllReplies() {
  const replies = await prisma.reply.findMany({
    where: {
      isDeleted: false,
    },
  });

  return replies;
}
