import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../utils/mail";
import { hashPassword } from "better-auth/crypto";

export type IUser = {
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  status: "ACTIVE" | "BLOCKED";
  phoneNumber?: string;
  address?: string;
  isDeleted: boolean;
};

const getAllUsers = async (currentUserRole?: string) => {
  const whereCondition: any = {
    isDeleted: false,
  };

  // If not SUPERADMIN, only show regular users
  if (currentUserRole !== "SUPERADMIN") {
    whereCondition.role = "USER";
  }

  const result = await prisma.user.findMany({
    where: whereCondition,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      phoneNumber: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const updateUser = async (id: string, data: Partial<IUser>) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const softDeleteUser = async (id: string) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

const createAdmin = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  // Check duplicate before calling auth
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) {
    throw new Error(`User with email '${data.email}' already exists`);
  }

  const result: any = await auth.api
    .signUpEmail({
      body: data,
      headers: new Headers({
        Origin: process.env.BETTER_AUTH_URL || "http://localhost:5000",
      }),
    })
    .catch((err) => {
      console.error("Critical error in Better Auth signUpEmail call:", err);
      throw err;
    });

  if (!result || result.error) {
    console.error("Better Auth Sign-up Error Body:", result?.error);
    throw new Error(result?.error?.message || "Internal sign-up failed");
  }

  console.log("Better Auth Result:", JSON.stringify(result, null, 2));

  // Promote to ADMIN
  const admin = await prisma.user.update({
    where: { id: result.user.id },
    data: { role: "ADMIN" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return admin;
};

const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email, isDeleted: false },
  });

  if (!user) {
    throw new Error("User with this email does not exist.");
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  await prisma.user.update({
    where: { email },
    data: {
      passwordResetOTP: otp,
      passwordResetOTPExpires: expires,
    },
  });

  // Send email with OTP
  await sendEmail({
    to: email,
    subject: "Password Reset OTP - BookNest",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #6366f1; text-align: center;">Reset Your Password</h2>
        <p>Hello ${user.name},</p>
        <p>We received a request to reset your password for your BookNest account. Use the following OTP to proceed:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background: #f3f4f6; padding: 10px 20px; border-radius: 5px; border: 1px dashed #6366f1;">
            ${otp}
          </span>
        </div>
        <p>This OTP is valid for <b>10 minutes</b>. If you did not request a password reset, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2024 BookNest Library Management System. All rights reserved.</p>
      </div>
    `,
  });

  return { message: "OTP sent to your email." };
};

const verifyOTP = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({
    where: { email, isDeleted: false },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.passwordResetOTP !== otp) {
    throw new Error("Invalid OTP.");
  }

  if (
    user.passwordResetOTPExpires &&
    user.passwordResetOTPExpires < new Date()
  ) {
    throw new Error("OTP has expired.");
  }

  return { success: true, message: "OTP verified successfully." };
};

const resetPassword = async (email: string, otp: string, password: string) => {
  // First verify OTP again for security
  const user = await prisma.user.findUnique({
    where: { email, isDeleted: false },
  });

  if (!user || user.passwordResetOTP !== otp) {
    throw new Error("Invalid OTP.");
  }

  if (
    user.passwordResetOTPExpires &&
    user.passwordResetOTPExpires < new Date()
  ) {
    throw new Error("OTP has expired.");
  }

  // Better Auth stores passwords in the Account table.
  // We need to update the password in the Account table for this user.
  // Note: Since we don't have direct access to Better Auth's hashing algorithm here,
  // we'll use a direct update. However, Better Auth 1.x typically uses scrypt.
  // We will use the better-auth logic if possible or update the account.

  // Find the credential account for this user
  const account = await prisma.account.findFirst({
    where: { userId: user.id, providerId: "credential" },
  });

  if (!account) {
    throw new Error("Credential account not found for this user.");
  }

  // Use better-auth/crypto to hash the password before saving
  const hashedPassword = await hashPassword(password);

  await prisma.account.update({
    where: { id: account.id },
    data: { password: hashedPassword }, 
  });

  // Clear OTP fields
  await prisma.user.update({
    where: { email },
    data: {
      passwordResetOTP: null,
      passwordResetOTPExpires: null,
    },
  });

  return { success: true, message: "Password reset successful." };
};

export const UserService = {
  getAllUsers,
  updateUser,
  softDeleteUser,
  createAdmin,
  forgotPassword,
  verifyOTP,
  resetPassword,
};
