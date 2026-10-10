import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPortalData } from "@/server/queries/portal";
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

  // portalData is already memoized in memory by PortalLayout (0ms duplicate cost)
  const portalData = await getPortalData(session.user.id, session.user.email);

  if (!portalData) {
    redirect("/login");
  }

  const res = await getActivePortalNoticesAction(portalData.user.role);
  const notices = res.success && res.data ? res.data : [];

  return <PortalNoticesClient notices={notices} userRole={portalData.user.role} />;
}
