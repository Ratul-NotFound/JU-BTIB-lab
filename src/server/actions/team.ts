"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { teamMemberSchema, type TeamMemberInput } from "@/server/validators/schemas";
import { invalidateCache, CACHE_TAGS } from "@/lib/cache-tags";
import { Role } from "@prisma/client";

export async function createTeamMember(input: TeamMemberInput) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
  const validated = teamMemberSchema.parse(input);

  const { projectIds = [], publicationIds = [], ...data } = validated;

  const member = await db.teamMember.create({
    data: {
      ...data,
      profileLinks: data.profileLinks ?? undefined,
      projects: {
        create: projectIds.map((projectId) => ({
          projectId,
        })),
      },
      publications: {
        create: publicationIds.map((publicationId) => ({
          publicationId,
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
      entity: "TeamMember",
      entityId: member.id,
      details: { name: member.name, role: member.category },
    },
  });

  invalidateCache(CACHE_TAGS.TEAM);
  invalidateCache(CACHE_TAGS.PROJECTS);
  invalidateCache(CACHE_TAGS.PUBLICATIONS);
  return { success: true, data: member };
}

export async function updateTeamMember(id: string, input: Partial<TeamMemberInput>) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
  const validated = teamMemberSchema.partial().parse(input);

  const { projectIds, publicationIds, ...data } = validated;

  const updated = await db.teamMember.update({
    where: { id },
    data: {
      ...data,
      profileLinks: data.profileLinks !== undefined ? (data.profileLinks ?? undefined) : undefined,
      ...(projectIds !== undefined && {
        projects: {
          deleteMany: {},
          create: projectIds.map((projectId) => ({
            projectId,
          })),
        },
      }),
      ...(publicationIds !== undefined && {
        publications: {
          deleteMany: {},
          create: publicationIds.map((publicationId) => ({
            publicationId,
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
      entity: "TeamMember",
      entityId: id,
      details: { name: updated.name },
    },
  });

  invalidateCache(CACHE_TAGS.TEAM);
  invalidateCache(CACHE_TAGS.PROJECTS);
  invalidateCache(CACHE_TAGS.PUBLICATIONS);
  return { success: true, data: updated };
}

export async function deleteTeamMember(id: string) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

  const deleted = await db.teamMember.delete({
    where: { id },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "DELETE",
      entity: "TeamMember",
      entityId: id,
      details: { name: deleted.name },
    },
  });

  invalidateCache(CACHE_TAGS.TEAM);
  invalidateCache(CACHE_TAGS.PROJECTS);
  invalidateCache(CACHE_TAGS.PUBLICATIONS);
  return { success: true };
}

export async function reorderTeamMembers(items: { id: string; order: number }[]) {
  await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

  await db.$transaction(
    items.map((item) =>
      db.teamMember.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    )
  );

  invalidateCache(CACHE_TAGS.TEAM);
  return { success: true };
}
