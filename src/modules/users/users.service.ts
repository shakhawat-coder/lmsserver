import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

export type IUser = {
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  status: "ACTIVE" | "BLOCKED";
  phoneNumber?: string;
  address?: string;
  isDeleted: boolean;
};

const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    where: {
      isDeleted: false,
      role: "USER",
    },
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

export const UserService = {
  getAllUsers,
  updateUser,
  softDeleteUser,
  createAdmin,
};
