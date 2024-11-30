"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function VoucherDelete(code: string, adminId: string) {
  if (code && adminId) {
    await prisma.voucher.update({
      where: {
        code,
      },
      data: {
        isDeleted: true,
        removedBy: adminId,
      },
    });
  }

  revalidatePath("/admin-dashboard/voucher/archive");
}

export async function VoucherExpire(code: string) {
  await prisma.voucher.update({
    where: {
      code,
    },
    data: {
      isActive: false,
    },
  });
}
