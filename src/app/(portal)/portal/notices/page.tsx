import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getActivePortalNoticesAction } from "@/server/actions/notices";
import { PortalNoticesClient } from "./portal-notices-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Lab Notices & Announcements | Research Portal",
  description: "Official notices, laboratory safety alerts, equipment downtime schedules, and thesis deadlines.",
};

export default async function PortalNoticesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const dbUser = await db.user.findFirst({
    where: {
      OR: [
        ...(session.user.id ? [{ id: session.user.id }] : []),
        ...(session.user.email ? [{ email: session.user.email.toLowerCase().trim() }] : []),
      ],
    },
  });

  if (!dbUser) {
    redirect("/login");
  }

  const res = await getActivePortalNoticesAction(dbUser.role);
  const notices = res.success && res.data ? res.data : [];

  return <PortalNoticesClient notices={notices} userRole={dbUser.role} />;
}
