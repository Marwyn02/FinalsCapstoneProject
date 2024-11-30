"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { ProfitUpdate, SetProfit } from "@/app/api/profit/ProfitSetAndAdd";

// import { withAccelerate } from "@prisma/extension-accelerate";
// const prisma = new PrismaClient().$extends(withAccelerate());

export async function ReservationPaid(reservationId: string, status: string) {
  if (reservationId !== "" && status === "pendingPayment") {
    const paidReservation = await prisma.reservation.update({
      where: {
        reservationId,
      },
      data: {
        status: "paid",
      },
    });

    if (paidReservation) {
      const reservation = await prisma.reservation.findUnique({
        where: {
          reservationId,
        },
      });

      if (!reservation) {
        throw new Error("Reservation not found.");
      }

      const { payment, checkIn } = reservation;

      const month = (new Date(checkIn).getMonth() + 1).toString(); // getMonth is 0-indexed
      const year = new Date(checkIn).getFullYear().toString();

      const existingProfit = await prisma.profit.findUnique({
        where: {
          month_year: {
            month,
            year,
          },
        },
      });

      if (existingProfit) {
        // Update the existing profit entry
        const values = {
          profitId: existingProfit.profitId,
          profit: Number(payment),
        };
        await ProfitUpdate(values);
      } else {
        // Create a new profit entry
        const profitId = uuidv4().slice(0, 13).toUpperCase();
        const values = {
          profitId,
          profit: Number(payment),
          bookings: 0,
          refund: 0,
          month,
          year,
        };
        await SetProfit(values);
      }
    }
    revalidatePath("/admin-dashboard");
    return { success: true };
  }
}
