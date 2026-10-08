"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { publicationSchema, type PublicationInput } from "@/server/validators/schemas";
import { invalidateCache, CACHE_TAGS } from "@/lib/cache-tags";
import { formatActionError } from "@/lib/action-error";
import { logAuditAsync } from "@/lib/audit";
import { Role } from "@prisma/client";

export async function createPublication(input: PublicationInput) {
  try {
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

    logAuditAsync({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "CREATE",
      entity: "Publication",
      entityId: publication.id,
      details: { title: publication.title, doi: publication.doi },
    });

    invalidateCache(CACHE_TAGS.PUBLICATIONS);
    invalidateCache(CACHE_TAGS.TEAM);
    return { success: true, data: publication };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to create publication"));
  }
}

export async function updatePublication(id: string, input: Partial<PublicationInput>) {
  try {
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

    logAuditAsync({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "UPDATE",
      entity: "Publication",
      entityId: id,
      details: { title: updated.title },
    });

    invalidateCache(CACHE_TAGS.PUBLICATIONS);
    invalidateCache(CACHE_TAGS.TEAM);
    return { success: true, data: updated };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to update publication"));
  }
}

export async function deletePublication(id: string) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

    const deleted = await db.publication.delete({
      where: { id },
    });

    logAuditAsync({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "DELETE",
      entity: "Publication",
      entityId: id,
      details: { title: deleted.title },
    });

    invalidateCache(CACHE_TAGS.PUBLICATIONS);
    invalidateCache(CACHE_TAGS.TEAM);
    return { success: true };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to delete publication"));
  }
}
