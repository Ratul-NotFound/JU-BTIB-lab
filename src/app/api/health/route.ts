import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "healthy";
  let dbLatencyMs = 0;
  let errorMsg: string | null = null;

  try {
    const dbStart = Date.now();
    await db.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
  } catch (err: unknown) {
    dbStatus = "unreachable";
    errorMsg = err instanceof Error ? err.message : "Database probe failed";
  }

  const totalLatencyMs = Date.now() - startTime;
  const isHealthy = dbStatus === "healthy";

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      latency: {
        totalMs: totalLatencyMs,
        databaseMs: dbLatencyMs,
      },
      services: {
        application: "operational",
        database: {
          status: dbStatus,
          pooler: "pgbouncer-transaction-mode",
          ...(errorMsg && { error: errorMsg }),
        },
      },
      environment: process.env.NODE_ENV || "production",
      version: "0.1.0",
    },
    {
      status: isHealthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
