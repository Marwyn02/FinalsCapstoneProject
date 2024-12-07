"use server";

import prisma from "@/lib/db";
import { AuditLog } from "@/features/audit/api/AuditLog";

export async function AccountLogout(adminId: string) {
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
