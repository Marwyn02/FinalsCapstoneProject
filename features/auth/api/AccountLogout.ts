"use server";

import { AuditLog } from "@/features/audit/api/AuditLog";
import prisma from "@/lib/db";

export async function AccountLogout(adminId: string, username: string) {
  await prisma.admin.update({
    where: {
      adminId,
    },
    data: {
      loggedOut: new Date(),
    },
  });

  // await AuditLog("Logout", { username, adminId });
}
