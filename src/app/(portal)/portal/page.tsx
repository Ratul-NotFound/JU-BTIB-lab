import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Role, AccountStatus } from "@prisma/client";
import { getPortalData } from "@/server/queries/portal";
import { getActivePortalNoticesAction } from "@/server/actions/notices";
import { ScholarDashboardClient } from "./scholar-dashboard-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Student Research Portal | BTIB Laboratory",
  description: "Manage instrument bookings, view lab schedules, and log experimental research hours.",
};

export default async function StudentPortalPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch portal data and active notices in parallel.
  // Because getPortalData is wrapped in React cache(), it reuses the exact same
  // in-memory promise initiated by PortalLayout with 0 duplicate DB round-trips.
  const [portalData, noticesRes] = await Promise.all([
    getPortalData(session.user.id, session.user.email),
    getActivePortalNoticesAction(session.user.role),
  ]);

  if (!portalData) {
    redirect("/login");
  }

  // Redirect Faculty to their dedicated portal
  if (portalData.user.role === Role.FACULTY) {
    redirect("/faculty");
  }

  const profile = portalData.studentProfile;
  const isPending = profile?.status === AccountStatus.PENDING_APPROVAL;
  const isRejected = profile?.status === AccountStatus.REJECTED;
  const totalHours = portalData.stats.totalHours;
  const notices = noticesRes.success && noticesRes.data ? noticesRes.data : [];

  return (
    <ScholarDashboardClient
      userName={session.user.name || portalData.user.name || "Scholar"}
      userEmail={session.user.email || portalData.user.email || ""}
      profile={profile}
      isPending={isPending}
      isRejected={isRejected}
      totalHours={totalHours}
      bookings={profile?.bookings || []}
      notices={notices}
    />
  );
}

