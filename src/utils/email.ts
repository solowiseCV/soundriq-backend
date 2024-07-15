import nodemailer from "nodemailer";
const EMAIL_ADDRESS = require("../config/index").EMAIL_ADDRESS;
const EMAIL_PASS = require("../config/index").EMAIL_PASS;

export const sendPasswordResetEmail = async (
  email: string,
  resetLink: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_ADDRESS,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL_ADDRESS,
    to: email,
    subject: "Password Reset",
    text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
  };

  await transporter.sendMail(mailOptions);
};
