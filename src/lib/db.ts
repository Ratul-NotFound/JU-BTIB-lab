import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function formatDatabaseUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  let url = rawUrl.trim();

  // Optimized settings for Supabase PgBouncer (Port 6543)
  if (url.includes(":6543") || url.includes("pooler.supabase.com")) {
    if (!url.includes("pgbouncer=true")) {
      url += (url.includes("?") ? "&" : "?") + "pgbouncer=true";
    }
    // Limit to 2 connections per serverless container to prevent pool exhaustion spikes
    if (!url.includes("connection_limit=")) {
      url += (url.includes("?") ? "&" : "?") + "connection_limit=2";
    }
    if (!url.includes("connect_timeout=")) {
      url += (url.includes("?") ? "&" : "?") + "connect_timeout=15";
    }
    if (!url.includes("pool_timeout=")) {
      url += (url.includes("?") ? "&" : "?") + "pool_timeout=15";
    }
  } else {
    if (!url.includes("connect_timeout=")) {
      url += (url.includes("?") ? "&" : "?") + "connect_timeout=15";
    }
  }

  return url;
}

const rawDbUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;
const dbUrl = formatDatabaseUrl(rawDbUrl);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log:
      process.env.DEBUG_QUERIES === "true"
        ? ["query", "error", "warn"]
        : ["error", "warn"],
  });

// Always cache client on globalThis so serverless warm containers reuse the single connection pool
globalForPrisma.prisma = db;
