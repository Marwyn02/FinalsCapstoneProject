"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { hash } from "bcrypt";

type AccountCreate = {
  adminId: string;
  username: string;
  password: string;
  email: string;
  role: string;
};

export async function AccountCreate(values: AccountCreate) {
  const { adminId, username, password, email, role } = values;

  const admin = await prisma.admin.findUnique({
    where: {
      username,
    },
  });

  if (admin) {
    return { success: false, existing: true };
  }

  const saltRounds = 10;
  const hashedPassword = await hash(password, saltRounds);

  await prisma.admin.create({
    data: {
      adminId,
      username,
      password: hashedPassword,
      email,
      role,
      loggedIn: null,
    },
  });

  revalidatePath("/admin-dashboard/account");
  return { success: true };
}
