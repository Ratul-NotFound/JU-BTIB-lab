"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { activitySchema, type ActivityInput } from "@/server/validators/schemas";
import { invalidateCache, CACHE_TAGS } from "@/lib/cache-tags";
import { Role } from "@prisma/client";

export async function createActivity(input: ActivityInput) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
  const validated = activitySchema.parse(input);

  const activity = await db.activity.create({
    data: validated,
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "CREATE",
      entity: "Activity",
      entityId: activity.id,
      details: { title: activity.title, type: activity.type },
    },
  });

  invalidateCache(CACHE_TAGS.ACTIVITIES);
  return { success: true, data: activity };
}

export async function updateActivity(id: string, input: Partial<ActivityInput>) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
  const validated = activitySchema.partial().parse(input);

  const updated = await db.activity.update({
    where: { id },
    data: validated,
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "UPDATE",
      entity: "Activity",
      entityId: id,
      details: { title: updated.title },
    },
  });

  invalidateCache(CACHE_TAGS.ACTIVITIES);
  return { success: true, data: updated };
}

export async function deleteActivity(id: string) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

  const deleted = await db.activity.delete({
    where: { id },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "DELETE",
      entity: "Activity",
      entityId: id,
      details: { title: deleted.title },
    },
  });

  invalidateCache(CACHE_TAGS.ACTIVITIES);
  return { success: true };
}
