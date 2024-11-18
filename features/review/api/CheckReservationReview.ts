"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// import { withAccelerate } from "@prisma/extension-accelerate";
// const prisma = new PrismaClient().$extends(withAccelerate());

export async function CheckReservationReview(reservationId: string) {
  try {
    if (reservationId) {
      const reservation = await prisma.reservation.findUnique({
        where: { reservationId },
        include: {
          review: true,
        },
      });

      // If reservation exist then block them for leaving a review again.
      if (reservation?.review) {
        return {
          success: false,
        };
      } else return { success: true };
    }
  } catch (error) {
    console.error("Error in reservation completion: ", error);
  }
}

export async function CheckReservationReviewExist(reservationId: string) {
  try {
    if (reservationId) {
      const response = await prisma.reservation.findUnique({
        where: { reservationId },
      });

      if (!response) return { success: false };
      else return { success: true };
    }
  } catch (error) {
    console.error("Error in checking reservation: ", error);
  }
}
