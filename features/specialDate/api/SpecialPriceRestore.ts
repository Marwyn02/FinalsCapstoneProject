"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function SpecialPriceRestore(id: string, adminId: string) {
  if (id && adminId) {
    const special = await prisma.specialPrice.findUnique({
      where: {
        id,
      },
    });

    if (special) {
      if (!special.isActive || !special.isDeleted) {
        return false;
      }
    }

    await prisma.specialPrice.update({
      where: {
        id,
      },
      data: {
        isDeleted: false,
        removedBy: null,
        addedBy: adminId,
      },
    });

    revalidatePath("/admin-dashboard/special-price");
  }
}
