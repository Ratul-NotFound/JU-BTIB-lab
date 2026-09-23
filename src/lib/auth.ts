import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/lib/auth.config";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        // Check for DB-backed rate limiting on login attempts
        const attempt = await db.loginAttempt.findUnique({
          where: { identifier: email },
        });

        if (attempt?.lockedUntil && attempt.lockedUntil > new Date()) {
          throw new Error("Account temporarily locked due to too many failed attempts. Try again later.");
        }

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user) {
          // Increment failed login attempt
          await db.loginAttempt.upsert({
            where: { identifier: email },
            update: {
              failedCount: { increment: 1 },
              lastAttemptAt: new Date(),
            },
            create: {
              identifier: email,
              failedCount: 1,
              lastAttemptAt: new Date(),
            },
          });
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
          const currentCount = (attempt?.failedCount || 0) + 1;
          const lock = currentCount >= 5;

          await db.loginAttempt.upsert({
            where: { identifier: email },
            update: {
              failedCount: currentCount,
              lockedUntil: lock ? new Date(Date.now() + 15 * 60 * 1000) : null,
              lastAttemptAt: new Date(),
            },
            create: {
              identifier: email,
              failedCount: 1,
              lastAttemptAt: new Date(),
            },
          });
          return null;
        }

        // Reset failed login attempts on successful login
        if (attempt) {
          await db.loginAttempt.delete({
            where: { identifier: email },
          });
        }

        // Record audit log for login
        await db.auditLog.create({
          data: {
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            action: "LOGIN",
            entity: "User",
            entityId: user.id,
            details: { email: user.email },
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.AUTH_SECRET,
});
