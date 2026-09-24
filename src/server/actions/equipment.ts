"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { equipmentSchema, type EquipmentInput } from "@/server/validators/schemas";
import { invalidateCache, CACHE_TAGS } from "@/lib/cache-tags";
import { Role } from "@prisma/client";

export async function createEquipment(input: EquipmentInput) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
  const validated = equipmentSchema.parse(input);

  const item = await db.equipment.create({
    data: {
      ...validated,
      specifications: validated.specifications ?? undefined,
    },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "CREATE",
      entity: "Equipment",
      entityId: item.id,
      details: { name: item.name },
    },
  });

  invalidateCache(CACHE_TAGS.EQUIPMENT);
  return { success: true, data: item };
}

export async function updateEquipment(id: string, input: Partial<EquipmentInput>) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
  const validated = equipmentSchema.partial().parse(input);

  const updated = await db.equipment.update({
    where: { id },
    data: {
      ...validated,
      specifications: validated.specifications ?? undefined,
    },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "UPDATE",
      entity: "Equipment",
      entityId: id,
      details: { name: updated.name },
    },
  });

  invalidateCache(CACHE_TAGS.EQUIPMENT);
  return { success: true, data: updated };
}

export async function deleteEquipment(id: string) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

  const deleted = await db.equipment.delete({
    where: { id },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "DELETE",
      entity: "Equipment",
      entityId: id,
      details: { name: deleted.name },
    },
  });

  invalidateCache(CACHE_TAGS.EQUIPMENT);
  return { success: true };
}

export async function reorderEquipment(items: { id: string; order: number }[]) {
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
}
