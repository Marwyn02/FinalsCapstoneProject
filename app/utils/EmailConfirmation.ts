"use server";

import nodemailer from "nodemailer";

export const EmailConfirmation = async (email: string, token: string) => {
  const transport = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });

  const confirmationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/confirmation/${token}`;

  // Sending email to the user
  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: email,
    cc: email,
    subject: "Confirm Your Reservation",
    html: `
    <h1>Confirm Your Reservation</h1>
    <p>Thank you for reserving with us! Please confirm your reservation by clicking the link below:</p>
    <a href="${confirmationUrl}">Confirm Reservation</a>
  `,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve("Email sent");
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    return { message: "Email sent!" };
  } catch (err) {
    return { message: `Error email, ${err}` };
  }
};
