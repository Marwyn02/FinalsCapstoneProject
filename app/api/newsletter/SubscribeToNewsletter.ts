"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function SubscribeToNewsletter(email: string) {
  if (email) {
    const response = await prisma.subsriber.findUnique({
      where: {
        email,
      },
    });

    if (response) {
      return {
        success: false,
        message:
          "We've found that this email address is already registered with us.",
      };
    }

    await prisma.subsriber.create({
      data: {
        email,
      },
    });

    revalidatePath("/");
    return {
      success: true,
      message:
        "Welcome aboard! You'll start receiving our latest updates soon.",
    };
  }
}
