"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { AuditAction } from "@prisma/client";

export async function loginAction(formData: { email: string; password: string }) {
  try {
    await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password." };
        default:
          return { success: false, error: "Authentication failed. Please verify credentials." };
      }
    }

    // In Next.js, redirect throws a special error which must be re-thrown
    if ((error as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Authentication error occurred.";
    return { success: false, error: message };
  }
}

export async function logoutAction() {
  await signOut({ redirect: false });
  return { success: true };
}

export async function changePasswordAction(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  try {
    const sessionUser = await requireAuth();

    if (!input.currentPassword || !input.newPassword || !input.confirmPassword) {
      return { success: false, error: "All password fields are required." };
    }

    if (input.newPassword !== input.confirmPassword) {
      return { success: false, error: "New password and confirmation do not match." };
    }

    if (input.newPassword.length < 8) {
      return { success: false, error: "New password must be at least 8 characters long." };
    }

    const user = await db.user.findUnique({
      where: { id: sessionUser.id },
    });

    if (!user) {
      return { success: false, error: "User account not found." };
    }

    const isCurrentValid = await bcrypt.compare(input.currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      return { success: false, error: "Current password is incorrect." };
    }

    const isSamePassword = await bcrypt.compare(input.newPassword, user.passwordHash);
    if (isSamePassword) {
      return { success: false, error: "New password cannot be identical to the current password." };
    }

    const newHash = await bcrypt.hash(input.newPassword, 12);

    await db.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        action: AuditAction.UPDATE,
        entity: "User",
        entityId: user.id,
        details: { action: "password_changed" },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to change password.",
    };
  }
}

