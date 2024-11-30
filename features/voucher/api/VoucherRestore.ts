"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function VoucherRestore(voucherCode: string, adminId: string) {
  if (voucherCode && adminId) {
    const voucher = await prisma.voucher.findUnique({
      where: {
        code: voucherCode,
      },
    });

    if (voucher) {
      if (!voucher.isActive || !voucher.isDeleted) {
        return false;
      }
    }

    await prisma.voucher.update({
      where: {
        code: voucherCode,
      },
      data: {
        isDeleted: false,
        removedBy: null,
        addedBy: adminId,
      },
    });

    revalidatePath("/admin-dashboard/voucher");
  }
}
