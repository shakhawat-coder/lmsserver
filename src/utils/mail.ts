import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent successfully to: ${to}`);
    console.log("   Message ID:", info.messageId);
    return info;
  } catch (error: any) {
    console.error(`❌ Failed to send email to: ${to}`);
    console.error("   Reason:", error.message || error);
    // Re-throw so the caller (auth) knows it failed
    throw error;
  }
};

