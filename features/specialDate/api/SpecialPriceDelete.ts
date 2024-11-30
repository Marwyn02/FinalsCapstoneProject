"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function SpecialPriceDelete(id: string, adminId: string) {
  if (id && adminId) {
    await prisma.specialPrice.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        removedBy: adminId,
      },
    });

    revalidatePath("/admin-dashboard/special-price");
  }
}
