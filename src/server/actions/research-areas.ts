"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { researchAreaSchema, type ResearchAreaInput } from "@/server/validators/schemas";
import { invalidateCache, CACHE_TAGS } from "@/lib/cache-tags";
import { Role } from "@prisma/client";

export async function createResearchArea(input: ResearchAreaInput) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
  const validated = researchAreaSchema.parse(input);

  const area = await db.researchArea.create({
    data: validated,
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "CREATE",
      entity: "ResearchArea",
      entityId: area.id,
      details: { title: area.title, slug: area.slug },
    },
  });

  invalidateCache(CACHE_TAGS.RESEARCH_AREAS);
  return { success: true, data: area };
}

export async function updateResearchArea(id: string, input: Partial<ResearchAreaInput>) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
  const existing = await db.researchArea.findUniqueOrThrow({ where: { id } });

  const validated = researchAreaSchema.partial().parse(input);

  const updated = await db.researchArea.update({
    where: { id },
    data: validated,
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "UPDATE",
      entity: "ResearchArea",
      entityId: id,
      details: { from: existing.title, to: updated.title },
    },
  });

  invalidateCache(CACHE_TAGS.RESEARCH_AREAS);
  return { success: true, data: updated };
}

export async function deleteResearchArea(id: string) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

  const deleted = await db.researchArea.delete({
    where: { id },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "DELETE",
      entity: "ResearchArea",
      entityId: id,
      details: { title: deleted.title },
    },
  });

  invalidateCache(CACHE_TAGS.RESEARCH_AREAS);
  return { success: true };
}

export async function reorderResearchAreas(items: { id: string; order: number }[]) {
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
}
