import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendEmail } from "../utils/mail";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // URL of your auth server
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  // Enable debug logging to see what Better Auth is doing
  logger: {
    level: "debug",
  },
  // Trusted origins resolve the MISSING_OR_NULL_ORIGIN error
  trustedOrigins: [
    process.env.FRONTEND_URL as string,
    process.env.BETTER_AUTH_URL as string,
    "http://localhost:5000",
    "http://localhost:3000",
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log(
        `📧 Attempting to send verification email to: ${user.email}...`,
      );
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="background-color: white; padding: 20px; border-radius: 8px;">
              <h2 style="color: #333 text-align: center;">Verify Your Email</h2>
              <p>Hi ${user.name},</p>
              <p>Thank you for signing up! To get started, please verify your email address by clicking the button below:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;"><a href="${url}">${url}</a></p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #999;">If you didn't sign up for this account, you can safely ignore this email.</p>
            </div>
          </div>
        `,
      });
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
      path: "/",
    },
    crossSubDomainCookies: {
      enabled: false,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false, // not settable by the client directly
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE",
        input: false,
      },
      phoneNumber: {
        type: "string",
        required: false,
        input: true,
      },
      address: {
        type: "string",
        required: false,
        input: true,
      },
      isDeleted: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
});
