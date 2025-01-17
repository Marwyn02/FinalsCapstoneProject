"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function ReviewAccept(reviewId: string, adminId: string) {
  if (reviewId && adminId) {
    await prisma.review.update({
      where: {
        reviewId,
      },
      data: {
        status: "confirmed",
        addedBy: adminId,
      },
    });
  }

  revalidatePath("/admin-dashboard/reviews");
}

export async function ReviewCancel(reviewId: string, adminId: string) {
  if (reviewId && adminId) {
    await prisma.review.update({
      where: { reviewId },
      data: {
        status: "canceled",
        removedBy: adminId,
      },
    });
  }

  revalidatePath("/admin-dashboard/reviews");
}
