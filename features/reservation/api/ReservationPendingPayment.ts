"use server";

import prisma from "@/lib/db";

export default async function ReservationPendingPayment(reservationId: string) {
  if (reservationId) {
    await prisma.reservation.update({
      where: {
        reservationId,
      },
      data: {
        status: "pendingPayment",
      },
    });
  }
}
