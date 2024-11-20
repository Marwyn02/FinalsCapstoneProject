"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

type ReservationUpdate = {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  adult: string | undefined;
  children: string | undefined;
  pwd: string | undefined;
  payment: string;
};

export async function ReservationUpdate(
  reservationId: string,
  values: ReservationUpdate
) {
  const { checkIn, checkOut, adult, children, pwd, payment } = values;

  const response = await prisma.reservation.update({
    where: {
      reservationId,
    },
    data: {
      checkIn,
      checkOut,
      adult,
      children,
      status: "confirmed",
      payment,
      // pwd
    },
  });
  if (response) {
    console.log("Reservation Update!");
  }

  revalidatePath("/admin-dashboard/reservations");

  return response;
}
