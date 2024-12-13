"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function ImageAccept(id: number, adminId: string) {
  await prisma.image.update({
    where: {
      id,
    },
    data: {
      status: "confirmed",
      addedBy: adminId,
    },
  });

  revalidatePath("/admin-dashboard/image");
}

export async function ImageReject(id: number, adminId: string) {
  await prisma.image.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      status: "rejected",
      removedBy: adminId,
    },
  });

  revalidatePath("/admin-dashboard/image");
}
