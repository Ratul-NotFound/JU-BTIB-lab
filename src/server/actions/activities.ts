"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { activitySchema, type ActivityInput } from "@/server/validators/schemas";
import { invalidateCache, CACHE_TAGS } from "@/lib/cache-tags";
import { formatActionError } from "@/lib/action-error";
import { logAuditAsync } from "@/lib/audit";
import { Role } from "@prisma/client";

export async function createActivity(input: ActivityInput) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
    const validated = activitySchema.parse(input);

    const activity = await db.activity.create({
      data: validated,
    });

    logAuditAsync({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "CREATE",
      entity: "Activity",
      entityId: activity.id,
      details: { title: activity.title, type: activity.type },
    });

    invalidateCache(CACHE_TAGS.ACTIVITIES);
    return { success: true, data: activity };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to create activity"));
  }
}

export async function updateActivity(id: string, input: Partial<ActivityInput>) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
    const validated = activitySchema.partial().parse(input);

    const updated = await db.activity.update({
      where: { id },
      data: validated,
    });

    logAuditAsync({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "UPDATE",
      entity: "Activity",
      entityId: id,
      details: { title: updated.title },
    });

    invalidateCache(CACHE_TAGS.ACTIVITIES);
    return { success: true, data: updated };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to update activity"));
  }
}

export async function deleteActivity(id: string) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

    const deleted = await db.activity.delete({
      where: { id },
    });

    logAuditAsync({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "DELETE",
      entity: "Activity",
      entityId: id,
      details: { title: deleted.title },
    });

    invalidateCache(CACHE_TAGS.ACTIVITIES);
    return { success: true };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to delete activity"));
  }
}
