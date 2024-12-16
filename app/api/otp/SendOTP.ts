"use server";

import prisma from "@/lib/db";
import nodemailer from "nodemailer";

let otps = new Map(); // Use Redis or database in production

export const SendOTP = async (email: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps.set(email, otp);

  // Set expiry for OTP
  setTimeout(() => otps.delete(email), 300000); // 5 minutes
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Save OTP to the database
  await prisma.otp.create({
    data: {
      email,
      code: otp,
      expiresAt,
    },
  });

  // Send OTP via email
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });

  const mailOptions = await transporter.sendMail({
    from: "no-reply@yourdomain.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  });

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transporter.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve("Email sent");
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    return { ok: true, message: "Email sent!" };
  } catch (err) {
    return { ok: false, message: `Error email, ${err}` };
  }
};
