"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ProfitUpdate } from "@/app/api/profit/ProfitSetAndAdd";
import { v4 as uuidv4 } from "uuid";

// import { withAccelerate } from "@prisma/extension-accelerate";
// const prisma = new PrismaClient().$extends(withAccelerate());

export async function ReservationSetComplete(
  reservationId: string,
  checkInMonth: string,
  checkInYear: string
) {
  if (!reservationId) {
    console.error("Reservation ID is required");
    return;
  }

  const reservation = await prisma.reservation.findUnique({
    where: {
      reservationId,
    },
  });

  if (!reservation) {
    console.error("Reservation not found");
    return;
  }

  const profit = await prisma.profit.findFirst({
    where: {
      month: checkInMonth,
      year: checkInYear,
    },
  });

  let profitId: string;

  if (!profit) {
    // Create a new profit record if not found
    profitId = uuidv4().toUpperCase();
    await prisma.profit.create({
      data: {
        profitId,
        profit: Number(reservation.downpayment) + Number(reservation.payment),
        bookings: 1,
        refund: 0,
        month: checkInMonth,
        year: checkInYear,
      },
    });
  } else {
    // Update the profit values
    const values = {
      profitId: profit.profitId,
      profit: Number(reservation.payment),
      bookings: 1,
      state: "suddenPayment",
    };

    await ProfitUpdate(values);
  }

  await prisma.reservation.update({
    where: {
      reservationId,
    },
    data: {
      status: "paid",
    },
  });

  revalidatePath("/admin-dashboard/reservations");
}
