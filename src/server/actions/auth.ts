"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

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
