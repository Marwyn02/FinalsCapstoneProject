"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function AccountRestore(username: string) {
  if (username) {
    await prisma.admin.update({
      where: {
        username,
      },
      data: {
        isDeleted: false,
      },
    });
  }

  revalidatePath("/admin-dashboard/account");
  return { success: true };
}
