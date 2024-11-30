"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function ReservationSetUpdate(reservationId: string) {
  const response = await prisma.reservation.update({
    where: {
      reservationId,
    },
    data: {
      status: "updating",
    },
  });
  if (response) {
    revalidatePath(`/admin-dashboard/reservations/update/${reservationId}`);
  }
  return response;
}
