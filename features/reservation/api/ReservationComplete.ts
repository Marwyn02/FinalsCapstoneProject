"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Profit } from "@/app/lib/types/types";
import { calculateTotalProfit } from "@/app/utils/ProfitHelpers";

// import { withAccelerate } from "@prisma/extension-accelerate";
// const prisma = new PrismaClient().$extends(withAccelerate());

export async function ReservationComplete(
  reservationId: string,
  profit: Profit[]
) {
  if (reservationId) {
    const update = await prisma.reservation.update({
      where: {
        reservationId,
      },
      data: {
        status: "complete",
      },
    });

    if (update) {
      await calculateTotalProfit(update, profit);
    }

    revalidatePath("/admin-dashboard");
  }
}
