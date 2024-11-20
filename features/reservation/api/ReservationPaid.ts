"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

// import { withAccelerate } from "@prisma/extension-accelerate";
// const prisma = new PrismaClient().$extends(withAccelerate());

export async function ReservationPaid(reservationId: string, status: string) {
  try {
    if (reservationId !== "" && status === "complete") {
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
          await prisma.profit.update({
            where: {
              profitId: existingProfit.profitId,
            },
            data: {
              profit: {
                increment: Number(payment),
              },
            },
          });
        } else {
          // Create a new profit entry
          const profitId = uuidv4().slice(0, 13).toUpperCase();

          await prisma.profit.create({
            data: {
              profitId,
              month,
              year,
              profit: Number(payment),
            },
          });
        }
      }
      revalidatePath("/admin-dashboard");
      return paidReservation;
    }
  } catch (error) {
    console.error("Error in reservation completion: ", error);
  } finally {
    redirect("/admin-dashboard");
  }
}
