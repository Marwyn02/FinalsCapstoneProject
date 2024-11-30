"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

type VoucherCreate = {
  id?: number | undefined;
  code: string;
  discountAmount: number | null;
  discountPercent: number | null;
  expiryDate: Date | null;
  isActive: boolean;
  adminId: string;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};

export async function VoucherCreate(data: VoucherCreate) {
  const { code, discountAmount, discountPercent, expiryDate, adminId } = data;

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
      addedBy: adminId,
    },
  });

  revalidatePath("/admin-dashboard/voucher");
}
