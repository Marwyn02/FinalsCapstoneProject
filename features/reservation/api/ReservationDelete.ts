"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// import { withAccelerate } from "@prisma/extension-accelerate";
// const prisma = new PrismaClient().$extends(withAccelerate());

export async function ReservationDelete(reservationId: string) {
  try {
    if (reservationId) {
      const deleteReservation = await prisma.reservation.update({
        where: {
          reservationId,
        },
        data: {
          status: "canceled",
        },
      });
      revalidatePath("/admin-dashboard/reservations");
      return deleteReservation;
    }
  } catch (error) {
    console.error("Error in reservation deletion: ", error);
  } finally {
    redirect("/admin-dashboard/reservations");
  }
}
