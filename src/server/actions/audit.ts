"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { Role, AuditAction } from "@prisma/client";

export async function pruneAuditLogsAction(olderThanDays = 90) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN]);

    const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);

    const result = await db.auditLog.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate,
        },
      },
    });

    // Record the pruning event
    await db.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        action: AuditAction.DELETE,
        entity: "AuditLog",
        details: {
          action: "prune_old_logs",
          deletedCount: result.count,
          cutoffDays: olderThanDays,
        },
      },
    });

    return { success: true, count: result.count };
  } catch (error) {
    console.error("Prune audit logs error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to prune audit logs.",
    };
  }
}
