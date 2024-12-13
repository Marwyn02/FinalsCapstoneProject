"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function ImageDelete(url: string, adminId: string) {
  await prisma.image.update({
    where: {
      url,
    },
    data: {
      isDeleted: true,
      status: "deleted",
      addedBy: null,
      removedBy: adminId,
    },
  });

  revalidatePath("/admin-dashboard/image");
}

export async function ImageRestore(url: string, adminId: string) {
  await prisma.image.update({
    where: {
      url,
    },
    data: {
      isDeleted: false,
      status: "confirmed",
      addedBy: adminId,
      removedBy: null,
    },
  });

  revalidatePath("/admin-dashboard/image");
}
