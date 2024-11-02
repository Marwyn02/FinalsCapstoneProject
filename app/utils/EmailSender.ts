"use server";

import nodemailer from "nodemailer";

type EmailType = {
  email: string;
  name: string;
  link: string;
  reservationId: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: string;
};

export const EmailSender = async (data: EmailType) => {
  const {
    email,
    name,
    link,
    reservationId,
    checkInDate,
    checkOutDate,
    totalPrice,
  } = data;

  const transport = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: process.env.MY_EMAIL,
    cc: email,
    subject: `Reservation Receipt for Your Stay at Our Hotel`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
      <h2 style="text-align: center; color: #333;">Reservation Receipt</h2>
      
      <p>Hello ${name},</p>
      <p>Thank you for choosing our hotel. Here is the summary of your reservation:</p>

      <hr />

      <h3>Reservation Details</h3>
      <p><strong>Reservation ID:</strong> ${reservationId}</p>
        <p><strong>Reservation Link:</strong><a href="${link}">${link}</a></p>
      <p><strong>Check-in Date:</strong> ${new Date(
        checkInDate
      ).toLocaleDateString()}</p>
      <p><strong>Check-out Date:</strong> ${new Date(
        checkOutDate
      ).toLocaleDateString()}</p>
      
      <h3>Guest Information</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>

      <h3>Total Cost</h3>
      <p style="font-size: 18px; color: #555;"><strong>Total Price:</strong> ₱${totalPrice}</p>

      <hr />

      <p style="text-align: center; font-size: 14px; color: #888;">
        Please present this email upon check-in. If you have any questions, feel free to contact us at any time.
      </p>
      <p style="text-align: center; font-size: 14px; color: #888;">We look forward to welcoming you!</p>
    </div>
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
