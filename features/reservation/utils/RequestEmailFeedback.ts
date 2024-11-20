"use server";

import nodemailer from "nodemailer";

type EmailType = {
  reservationId: string;
  name: string;
  checkIn: Date;
  checkOut: Date;
  email: string;
};

export const RequestEmailFeedback = async (data: EmailType) => {
  const { reservationId, name, checkIn, checkOut, email } = data;

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/feedback/${reservationId}`;

  const transport = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: email,
    subject: `Thank You for Staying with Us!`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
      <h2 style="text-align: center; color: #333;">We Value Your Feedback!</h2>
  
  <p>Dear ${name},</p>
  <p>Thank you for staying at <strong>Crisanto Transient House</strong>. It was a pleasure to host you, and we hope you enjoyed your stay.</p>
  <p>Your feedback is very important to us as it helps us improve and provide a better experience for future guests. We would greatly appreciate it if you could take a few minutes to share your thoughts about your stay.</p>

      <hr />

  <h4><strong><a href="${url}" style="text-decoration: none; color: #1a73e8;">Share Your Feedback Here</a></strong></h4>

    
        <p><strong>Reservation ID:</strong> ${reservationId}</p>
      <p><strong>Check-in Date:</strong> ${new Date(
        checkIn
      ).toLocaleDateString()}</p>
      <p><strong>Check-out Date:</strong> ${new Date(
        checkOut
      ).toLocaleDateString()}</p>
      
      <h3>Guest Information</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>

      <hr />

      <p style="text-align: center; font-size: 14px; color: #888;">
        Thank you again for choosing Crisanto Transient House. We look forward to hosting you again in the future.
      </p>
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
