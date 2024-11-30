"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

// import { withAccelerate } from "@prisma/extension-accelerate";
// const prisma = new PrismaClient().$extends(withAccelerate());

export async function ReservationDelete(
  reservationId: string,
  adminId: string
) {
  if (reservationId && adminId) {
    await prisma.reservation.update({
      where: {
        reservationId,
      },
      data: {
        status: "canceled",
        removedBy: adminId,
      },
    });
    revalidatePath("/admin-dashboard/reservations");
  }
}
