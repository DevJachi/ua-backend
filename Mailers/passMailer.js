import nodemailer from "nodemailer";

export const createGmailTransporter = async () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, // your Gmail address
      pass: process.env.GMAIL_PASS, // app password (not normal Gmail password)
    },
  });
};
