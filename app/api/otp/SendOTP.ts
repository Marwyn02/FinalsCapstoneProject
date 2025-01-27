"use server";

import prisma from "@/lib/db";
import nodemailer from "nodemailer";

export const SendOTP = async (email: string) => {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Set OTP expiration time (5 minutes)
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Save OTP to the database
  try {
    await prisma.otp.create({
      data: {
        email,
        code: otp,
        expiresAt,
      },
    });
  } catch (dbError: any) {
    return { ok: false, message: `Database error: ${dbError.message}` };
  }

  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL, // Your Gmail address
      pass: process.env.MY_PASSWORD, // Use an App Password if using Gmail
    },
  });

  // Email options
  const mailOptions = {
    from: "no-reply@yourdomain.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}\nThis code will expire in 5 minutes.`,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    return { ok: true, message: "Email sent!" };
  } catch (emailError: any) {
    return { ok: false, message: `Email sending error: ${emailError.message}` };
  }
};
