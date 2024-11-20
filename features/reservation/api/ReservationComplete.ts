"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// import { withAccelerate } from "@prisma/extension-accelerate";
// const prisma = new PrismaClient().$extends(withAccelerate());

export async function ReservationComplete(
  reservationId: string,
  status: string
) {
  try {
    if (reservationId && status) {
      await prisma.reservation.update({
        where: {
          reservationId,
        },
        data: {
          status: "complete",
        },
      });
    }
  } catch (error) {
    console.error("Error in reservation completion: ", error);
  }
}
