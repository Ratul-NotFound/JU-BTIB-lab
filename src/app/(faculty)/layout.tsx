import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { getPortalData } from "@/server/queries/portal";
import { PortalAppShell } from "@/components/portal/portal-app-shell";

export const metadata: Metadata = {
  title: "Faculty Supervisor Suite | BTIB Laboratory",
  description: "Academic faculty supervision portal for scholar experiment logs and equipment reservations.",
};

export default async function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Ensure only Faculty, Super Admin, and Editor can enter
  if (
    session.user.role !== Role.FACULTY &&
    session.user.role !== Role.SUPER_ADMIN &&
    session.user.role !== Role.EDITOR
  ) {
    redirect("/portal");
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
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {children}
      </div>
    </PortalAppShell>
  );
}
