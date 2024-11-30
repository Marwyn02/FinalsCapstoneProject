"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function AccountSetMaster(username: string) {
  const admin = await prisma.admin.findUnique({
    where: {
      username,
      role: "admin",
    },
  });

  if (!admin) {
    return { success: false, existing: true };
  }

  await prisma.admin.update({
    where: {
      username,
    },
    data: {
      role: "master",
    },
  });

  revalidatePath("/admin-dashboard/account");
  return { success: true };
}

export async function AccountSetAdmin(username: string) {
  const admin = await prisma.admin.findUnique({
    where: {
      username,
      role: "master",
    },
  });

  if (!admin) {
    return { success: false, existing: true };
  }

  await prisma.admin.update({
    where: {
      username,
    },
    data: {
      role: "admin",
    },
  });

  revalidatePath("/admin-dashboard/account");
  return { success: true };
}
