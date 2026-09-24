"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { contactMessageSchema, type ContactMessageInput } from "@/server/validators/schemas";
import { Role, MessageStatus } from "@prisma/client";
import { headers } from "next/headers";
import crypto from "crypto";

export async function submitContactMessage(input: ContactMessageInput) {
  // Validate input
  const validated = contactMessageSchema.parse(input);

  // Honeypot trap check
  if (validated.honeypot && validated.honeypot.length > 0) {
    return { success: true }; // Silently succeed for bots
  }

  // Get and hash client IP for privacy-compliant rate limiting
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const rawIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
  const ipHash = crypto.createHash("sha256").update(rawIp).digest("hex");

  // Check rate limit: max 5 messages in 1 hour from the same IP
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentMessagesCount = await db.contactMessage.count({
    where: {
      ipHash,
      createdAt: { gte: oneHourAgo },
    },
  });

  if (recentMessagesCount >= 5) {
    throw new Error("Too many messages submitted from your connection. Please wait before trying again.");
  }

  const message = await db.contactMessage.create({
    data: {
      name: validated.name,
      email: validated.email,
      subject: validated.subject,
      message: validated.message,
      ipHash,
      status: MessageStatus.NEW,
    },
  });

  return { success: true, id: message.id };
}

export async function updateContactMessageStatus(id: string, status: MessageStatus) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

  const updated = await db.contactMessage.update({
    where: { id },
    data: { status },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "UPDATE",
      entity: "ContactMessage",
      entityId: id,
      details: { status },
    },
  });

  return { success: true, data: updated };
}

export async function deleteContactMessage(id: string) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

  await db.contactMessage.delete({
    where: { id },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "DELETE",
      entity: "ContactMessage",
      entityId: id,
    },
  });

  return { success: true };
}
