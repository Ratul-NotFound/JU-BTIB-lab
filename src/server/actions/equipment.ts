"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { equipmentSchema, type EquipmentInput } from "@/server/validators/schemas";
import { invalidateCache, CACHE_TAGS } from "@/lib/cache-tags";
import { formatActionError } from "@/lib/action-error";
import { logAuditAsync } from "@/lib/audit";
import { Role } from "@prisma/client";

export async function createEquipment(input: EquipmentInput) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
    const validated = equipmentSchema.parse(input);

    const item = await db.equipment.create({
      data: {
        ...validated,
        specifications: validated.specifications ?? undefined,
      },
    });

    logAuditAsync({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "CREATE",
      entity: "Equipment",
      entityId: item.id,
      details: { name: item.name },
    });

    invalidateCache(CACHE_TAGS.EQUIPMENT);
    return { success: true, data: item };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to create equipment item"));
  }
}

export async function updateEquipment(id: string, input: Partial<EquipmentInput>) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
    const validated = equipmentSchema.partial().parse(input);

    const updated = await db.equipment.update({
      where: { id },
      data: {
        ...validated,
        specifications: validated.specifications ?? undefined,
      },
    });

    logAuditAsync({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "UPDATE",
      entity: "Equipment",
      entityId: id,
      details: { name: updated.name },
    });

    invalidateCache(CACHE_TAGS.EQUIPMENT);
    return { success: true, data: updated };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to update equipment item"));
  }
}

export async function deleteEquipment(id: string) {
  try {
    const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

    const deleted = await db.equipment.delete({
      where: { id },
    });

    logAuditAsync({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "DELETE",
      entity: "Equipment",
      entityId: id,
      details: { name: deleted.name },
    });

    invalidateCache(CACHE_TAGS.EQUIPMENT);
    return { success: true };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to delete equipment item"));
  }
}

export async function reorderEquipment(items: { id: string; order: number }[]) {
  try {
    await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

    await db.$transaction(
      items.map((item) =>
        db.equipment.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    invalidateCache(CACHE_TAGS.EQUIPMENT);
    return { success: true };
  } catch (error) {
    throw new Error(formatActionError(error, "Failed to reorder equipment"));
  }
}
