"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { researchAreaSchema, type ResearchAreaInput } from "@/server/validators/schemas";
import { invalidateCache, CACHE_TAGS } from "@/lib/cache-tags";
import { formatActionError } from "@/lib/action-error";
import { logAuditAsync } from "@/lib/audit";
import { Role } from "@prisma/client";

export async function createResearchArea(input: ResearchAreaInput) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
    const validated = researchAreaSchema.parse(input);

    const area = await db.researchArea.create({
      data: validated,
    });

    logAuditAsync({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "CREATE",
      entity: "ResearchArea",
      entityId: area.id,
      details: { title: area.title, slug: area.slug },
    });

    invalidateCache(CACHE_TAGS.RESEARCH_AREAS);
    return { success: true, data: area };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to create research area"));
  }
}

export async function updateResearchArea(id: string, input: Partial<ResearchAreaInput>) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
    const existing = await db.researchArea.findUniqueOrThrow({ where: { id } });

    const validated = researchAreaSchema.partial().parse(input);

    const updated = await db.researchArea.update({
      where: { id },
      data: validated,
    });

    logAuditAsync({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "UPDATE",
      entity: "ResearchArea",
      entityId: id,
      details: { from: existing.title, to: updated.title },
    });

    invalidateCache(CACHE_TAGS.RESEARCH_AREAS);
    return { success: true, data: updated };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to update research area"));
  }
}

export async function deleteResearchArea(id: string) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

    const deleted = await db.researchArea.delete({
      where: { id },
    });

    logAuditAsync({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "DELETE",
      entity: "ResearchArea",
      entityId: id,
      details: { title: deleted.title },
    });

    invalidateCache(CACHE_TAGS.RESEARCH_AREAS);
    return { success: true };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to delete research area"));
  }
}

export async function reorderResearchAreas(items: { id: string; order: number }[]) {
  try {
    await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

    await db.$transaction(
      items.map((item) =>
        db.researchArea.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    invalidateCache(CACHE_TAGS.RESEARCH_AREAS);
    return { success: true };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to reorder research areas"));
  }
}
