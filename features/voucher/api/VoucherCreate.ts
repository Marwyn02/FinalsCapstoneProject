"use server";

import { Voucher } from "@/app/lib/types/types";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function VoucherCreate(data: Voucher) {
  const { code, discountAmount, discountPercent, expiryDate } = data;

  const voucher = await prisma.voucher.findUnique({
    where: { code },
  });

  if (voucher) {
    return { success: false, message: "Voucher Code is already exist!" };
  }

  await prisma.voucher.create({
    data: {
      code,
      discountAmount,
      discountPercent,
      expiryDate,
    },
  });

  revalidatePath("/admin-dashboard/voucher");
}
