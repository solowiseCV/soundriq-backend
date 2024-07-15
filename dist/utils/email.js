"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const EMAIL_ADDRESS = require("../config/index").EMAIL_ADDRESS;
const EMAIL_PASS = require("../config/index").EMAIL_PASS;
const sendPasswordResetEmail = async (email, resetLink) => {
    const transporter = nodemailer_1.default.createTransport({
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
exports.sendPasswordResetEmail = sendPasswordResetEmail;
