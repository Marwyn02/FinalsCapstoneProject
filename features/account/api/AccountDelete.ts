"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function AccountDelete(username: string) {
  if (username) {
    await prisma.admin.update({
      where: {
        username,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  revalidatePath("/admin-dashboard/account");
  return { success: true };
}
