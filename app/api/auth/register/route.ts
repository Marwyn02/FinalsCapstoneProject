"use server";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, lastName, password } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log({ email, hashedPassword });

    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        address: "P1 B6 L6 Sunshine Homes",
        contactNumber: "09192319278",
        honorific: "Mr",
        loyaltyLevel: "Classic",
      },
    });
    console.log("New User: ", newUser);
  } catch (error) {
    console.log("Error in Register Handler", error);
    return NextResponse.json({ message: "Error occurred" }, { status: 400 });
  }

  return NextResponse.json(
    { message: "Request Success from Register Route" },
    { status: 200 }
  );
}
