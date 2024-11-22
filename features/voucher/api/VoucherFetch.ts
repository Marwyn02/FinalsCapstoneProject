"use server";

import prisma from "@/lib/db";

export async function VoucherFetchAll() {
  const today = new Date();

  const vouchers = await prisma.voucher.findMany({
    where: {
      expiryDate: {
        gt: today,
      },
    },
  });

  return vouchers;
}

export async function VoucherFetchOne(voucherCode: string) {
  if (voucherCode) {
    const voucher = await prisma.voucher.findUnique({
      where: {
        code: voucherCode,
      },
    });

    return voucher;
  }
}
