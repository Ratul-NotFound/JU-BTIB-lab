import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  neonKeepAliveStarted?: boolean;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.DEBUG_QUERIES === "true"
        ? ["query", "error", "warn"]
        : ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Prevent Neon compute scale-to-zero cold start delays (Neon suspends at 5m inactivity)
if (!globalForPrisma.neonKeepAliveStarted && typeof window === "undefined") {
  globalForPrisma.neonKeepAliveStarted = true;
  const KEEPALIVE_INTERVAL_MS = 3.5 * 60 * 1000;
  const timer = setInterval(async () => {
    try {
      await db.$queryRaw`SELECT 1`;
    } catch {
      // Background ping handled silently
    }
  }, KEEPALIVE_INTERVAL_MS);

  if (typeof timer.unref === "function") {
    timer.unref();
  }
}
