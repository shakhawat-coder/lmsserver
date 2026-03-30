import "dotenv/config";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";

async function seedAdmin() {
  try {
    const name = process.env.SUPER_ADMIN_NAME || "Super Admin";
    const email = process.env.SUPER_ADMIN_EMAIL || "admin@example.com";
    const password = process.env.SUPER_ADMIN_PASSWORD || "Admin@12345";


    // Check if superadmin already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log("✅ Superadmin already exists:", existingUser.email);
      return;
    }

    // Use auth.api directly (pass an origin to satisfy CSRF checks)
    const result = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: new Headers({
        Origin: process.env.BETTER_AUTH_URL || "http://localhost:5000",
      }),
    });

    if (!result?.user) {
      throw new Error("Sign-up did not return a user.");
    }

    // Promote to SUPERADMIN and verify email
    const superAdmin = await prisma.user.update({
      where: { id: result.user.id },
      data: {
        role: "SUPERADMIN",
        emailVerified: true,
      },
    });

    console.log("🎉 Superadmin created successfully:");
    console.log("   Name          :", superAdmin.name);
    console.log("   Email         :", superAdmin.email);
    console.log("   Role          :", superAdmin.role);
    console.log("   Email Verified:", superAdmin.emailVerified);
  } catch (error) {
    console.error("❌ seedAdmin error:", error);
    throw error;
  }
}

seedAdmin()
  .then(() => console.log("seedAdmin finished"))
  .catch((err) => {
    console.error("seedAdmin failed:", err);
    process.exit(1);
  });
