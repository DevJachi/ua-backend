import nodemailer from "nodemailer";

// Create transporter
export const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email", // for testing only
  port: 587,
  secure: false, // true for 465, false for others
  auth: {
    user: process.env.ETHEREAL_USER, // from Ethereal account
    pass: process.env.ETHEREAL_PASS,
  },
});
