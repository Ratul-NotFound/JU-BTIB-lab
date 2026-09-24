import { db } from "@/lib/db";
import { MessageStatus, Prisma } from "@prisma/client";

export async function getContactMessages(options?: {
  status?: MessageStatus;
  limit?: number;
}) {
  try {
    const where: Prisma.ContactMessageWhereInput = {};
    if (options?.status) {
      where.status = options.status;
    }

    return await db.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: options?.limit,
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return [];
  }
}
