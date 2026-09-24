"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { publicationSchema, type PublicationInput } from "@/server/validators/schemas";
import { invalidateCache, CACHE_TAGS } from "@/lib/cache-tags";
import { Role } from "@prisma/client";

export async function createPublication(input: PublicationInput) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
  const validated = publicationSchema.parse(input);

  const { areaIds, teamMemberIds, ...data } = validated;

  const publication = await db.publication.create({
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
      entity: "Publication",
      entityId: publication.id,
      details: { title: publication.title, doi: publication.doi },
    },
  });

  invalidateCache(CACHE_TAGS.PUBLICATIONS);
  return { success: true, data: publication };
}

export async function updatePublication(id: string, input: Partial<PublicationInput>) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
  const validated = publicationSchema.partial().parse(input);

  const { areaIds, teamMemberIds, ...data } = validated;

  const updated = await db.publication.update({
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
      entity: "Publication",
      entityId: id,
      details: { title: updated.title },
    },
  });

  invalidateCache(CACHE_TAGS.PUBLICATIONS);
  return { success: true, data: updated };
}

export async function deletePublication(id: string) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

  const deleted = await db.publication.delete({
    where: { id },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "DELETE",
      entity: "Publication",
      entityId: id,
      details: { title: deleted.title },
    },
  });

  invalidateCache(CACHE_TAGS.PUBLICATIONS);
  return { success: true };
}
