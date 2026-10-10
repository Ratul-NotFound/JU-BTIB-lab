import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPortalData } from "@/server/queries/portal";
import { PortalAppShell } from "@/components/portal/portal-app-shell";

export const metadata: Metadata = {
  title: "Research Portal | BTIB Laboratory",
  description: "Academic lab portal for students, scholars, and faculty supervisors at Jahangirnagar University.",
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const portalData = await getPortalData(session.user.id, session.user.email);

  if (!portalData) {
    redirect("/login");
  }

  return (
    <PortalAppShell
      user={portalData.user}
      studentProfile={portalData.studentProfile}
      facultyProfile={portalData.facultyProfile}
      stats={portalData.stats}
    >
      {children}
    </PortalAppShell>
  );
}
