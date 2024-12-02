"use server";

import nodemailer from "nodemailer";

type EmailType = {
  email: string;
  name: string;
  message: string;
  subject: string;
};

export const InquiryEmailSender = async (data: EmailType) => {
  const { email, name, message, subject } = data;

  const transport = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.MY_EMAIL,
    // cc: email,
    // no cc
    subject: `Inquiry`,
    html: `
    <div style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">

    <div style="background-color: #007bff; color: #ffffff; text-align: center; padding: 20px;">
      <h1 style="margin: 0; font-size: 24px;">New Inquiry Received</h1>
    </div>


    <div style="padding: 20px; color: #333333;">
      <p style="margin: 10px 0;"><span style="font-weight: bold;">Name:</span> ${name}</p>
      <p style="margin: 10px 0;"><span style="font-weight: bold;">Email:</span> ${email}</p>
      <p style="margin: 10px 0;"><span style="font-weight: bold;">Subject:</span> ${subject}</p>
      <p style="margin: 10px 0;"><span style="font-weight: bold;">Message:</span></p>
      <p style="margin: 10px 0;">${message}</p>
    </div>

    <div style="text-align: center; background-color: #f4f4f4; padding: 10px; font-size: 12px; color: #666666;">
      <p style="margin: 0;">This is an automated email. Please do not reply to this address.</p>
    </div>
  </div>
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
