"use server";

import prisma from "@/lib/db";

export async function VoucherFetchAll() {
  const today = new Date();

  const vouchers = await prisma.voucher.findMany({
    where: {
      expiryDate: {
        gt: today,
      },
      isActive: true,
      isDeleted: false,
    },
  });

  return vouchers;
}

export async function VoucherFetchOne(voucherCode: string) {
  if (voucherCode) {
    const voucher = await prisma.voucher.findUnique({
      where: {
        code: voucherCode,
        isActive: true,
      },
    });

    return voucher;
  }
}

export async function VoucherFetchArchivedInAdmin() {
  const today = new Date();

  const vou = await prisma.voucher.findMany({
    where: {
      expiryDate: {
        lt: today,
      },
      isActive: true,
    },
  });

  if (vou) {
    vou.map(
      async (v) =>
        await prisma.voucher.update({
          where: {
            code: v.code,
          },
          data: {
            isActive: false,
          },
        })
    );
  }

  const voucher = await prisma.voucher.findMany({
    where: {
      OR: [{ isDeleted: true }, { isActive: false }],
    },
    include: {
      removedByAdmin: true,
    },
  });

  return voucher;
}
