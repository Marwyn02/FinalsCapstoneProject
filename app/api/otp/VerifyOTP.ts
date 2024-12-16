"use server";

import prisma from "@/lib/db";

export async function verifyOTP(otp: string) {
  const otpRecord = await prisma.otp.findFirst({
    where: {
      code: otp,
      expiresAt: { gte: new Date() },
    },
  });

  if (!otpRecord) {
    return { status: 400, message: "Invalid or expired OTP" };
  }
  // try {
  //   await sendMailPromise();
  //   return { ok: true, message: "Email sent!" };
  // } catch (err) {
  //   return { ok: false, message: `Error email, ${err}` };
  // }

  // Optionally, delete the OTP after successful verification
  await prisma.otp.delete({ where: { id: otpRecord.id } });

  return { status: 200, message: "OTP verified successfully" };
}
