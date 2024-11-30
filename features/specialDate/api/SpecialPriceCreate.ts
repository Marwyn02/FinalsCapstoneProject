"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

type SpecialPrice = {
  id: string;
  date: Date;
  price: number;
  adminId: string;
};

export async function SpecialPriceCreate(data: SpecialPrice) {
  const { id, date, price, adminId } = data;

  if (id && date && price && adminId) {
    const special = await prisma.specialPrice.findUnique({
      where: {
        date,
      },
    });

    if (special) {
      return { success: false };
    }

    await prisma.specialPrice.create({
      data: {
        id,
        date,
        price,
        addedBy: adminId,
      },
    });

    revalidatePath("/admin-dashboard/special-price");
  }
}
