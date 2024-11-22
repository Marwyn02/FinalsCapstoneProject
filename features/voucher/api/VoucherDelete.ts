"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function VoucherDelete(code: string) {
  if (code) {
    await prisma.voucher.delete({
      where: {
        code,
      },
    });
  }

  revalidatePath("/admin-dashboard/voucher");
}
