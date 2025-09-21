import { transporter } from "../Mailers/mailer.js";
import nodemailer from "nodemailer";
import { generateVerificationToken } from "./generateVerificationCode.js";

export const sendVerificationEmail = async (to, code) => {
  try {
    const info = await transporter.sendMail({
      from: '"Ugwu Academy" <support@ugwuacademy.com>',
      to,
      subject: "Verify your email",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="text-align: center;">
            <img src="../assets/UA-bbg-wobg2.png" alt="Logo" width="80"/>
            <h2 style="color: #333;">Email Verification</h2>
          </div>
          <p style="font-size: 16px; color: #555;">
            Please use the verification code below:
          </p>
          <h1 style="text-align: center; color: #2c3e50; letter-spacing: 3px;">
            <b>${code}</b>
          </h1>
          <p style="font-size: 14px; color: #999;">
            If you did not request this, ignore this email.
          </p>
        </div>
      `,
    });

    console.log("Message sent:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info)); 
  } catch (err) {
    console.error("Error sending email:", err);
  }
};
