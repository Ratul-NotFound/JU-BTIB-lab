"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { projectSchema, type ProjectInput } from "@/server/validators/schemas";
import { invalidateCache, CACHE_TAGS } from "@/lib/cache-tags";
import { Role } from "@prisma/client";

export async function createProject(input: ProjectInput) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
  const validated = projectSchema.parse(input);

  const { areaIds, teamMemberIds, ...data } = validated;

  const project = await db.project.create({
    data: {
      ...data,
      areas: {
        create: areaIds.map((areaId) => ({
          researchAreaId: areaId,
        })),
      },
      teamMembers: {
        create: teamMemberIds.map((memberId) => ({
          teamMemberId: memberId,
        })),
      },
    },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "CREATE",
      entity: "Project",
      entityId: project.id,
      details: { title: project.title, slug: project.slug },
    },
  });

  invalidateCache(CACHE_TAGS.PROJECTS);
  return { success: true, data: project };
}

export async function updateProject(id: string, input: Partial<ProjectInput>) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
  const validated = projectSchema.partial().parse(input);

  const { areaIds, teamMemberIds, ...data } = validated;

  const updated = await db.project.update({
    where: { id },
    data: {
      ...data,
      ...(areaIds !== undefined && {
        areas: {
          deleteMany: {},
          create: areaIds.map((areaId) => ({
            researchAreaId: areaId,
          })),
        },
      }),
      ...(teamMemberIds !== undefined && {
        teamMembers: {
          deleteMany: {},
          create: teamMemberIds.map((memberId) => ({
            teamMemberId: memberId,
          })),
        },
      }),
    },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "UPDATE",
      entity: "Project",
      entityId: id,
      details: { title: updated.title },
    },
  });

  invalidateCache(CACHE_TAGS.PROJECTS);
  return { success: true, data: updated };
}

export async function deleteProject(id: string) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

  const deleted = await db.project.delete({
    where: { id },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "DELETE",
      entity: "Project",
      entityId: id,
      details: { title: deleted.title },
    },
  });

  invalidateCache(CACHE_TAGS.PROJECTS);
  return { success: true };
}

export async function reorderProjects(items: { id: string; order: number }[]) {
  await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

  await db.$transaction(
    items.map((item) =>
      db.project.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    )
  );

  invalidateCache(CACHE_TAGS.PROJECTS);
  return { success: true };
}
