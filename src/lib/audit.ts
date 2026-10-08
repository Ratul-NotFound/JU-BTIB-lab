import { db } from "@/lib/db";
import { AuditAction, Prisma } from "@prisma/client";
import { after } from "next/server";

export interface LogAuditParams {
  userId?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  action: AuditAction;
  entity: string;
  entityId?: string | null;
  details?: Record<string, unknown> | null;
}

/**
 * Non-blocking Audit Logging using Next.js 15 after()
 * Sends the HTTP response back to the client immediately while persisting
 * the audit log entry asynchronously in the background.
 */
export function logAuditAsync(params: LogAuditParams) {
  after(async () => {
    try {
      await db.auditLog.create({
        data: {
          userId: params.userId || null,
          userName: params.userName || null,
          userEmail: params.userEmail || null,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId || null,
          details: (params.details as Prisma.InputJsonValue) ?? undefined,
        },
      });
    } catch (err) {
      console.error("Audit log background write error:", err);
    }
  });
}
