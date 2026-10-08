import { db } from "@/lib/db";
import { MessageStatus, Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/cache-tags";

function getCachedContactMessages(status?: MessageStatus, limit?: number) {
  const cacheKey = ["contact-messages-list", status ?? "all", limit?.toString() ?? "all"];
  return unstable_cache(
    async () => {
      const where: Prisma.ContactMessageWhereInput = {};
      if (status) {
        where.status = status;
      }

      return await db.contactMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
      });
    },
    cacheKey,
    {
      tags: [CACHE_TAGS.CONTACT],
      revalidate: 60,
    }
  )();
}

export const getContactMessages = cache(async function getContactMessages(options?: {
  status?: MessageStatus;
  limit?: number;
}) {
  try {
    return await getCachedContactMessages(options?.status, options?.limit);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return [];
  }
});
