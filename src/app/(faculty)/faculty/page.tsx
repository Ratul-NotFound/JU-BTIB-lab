import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { getFacultyDashboardDataAction } from "@/server/actions/faculty";
import { FacultyDashboardClient } from "./faculty-dashboard-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Faculty Dashboard | BTIB Laboratory",
  description: "Academic faculty supervision portal for scholar experiment logs and equipment reservations.",
};

export default async function FacultyDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== Role.FACULTY && session.user.role !== Role.SUPER_ADMIN) {
    redirect("/portal");
  }

  // Get Faculty Profile if exists
  const facultyProfile = await db.facultyProfile.findUnique({
    where: { userId: session.user.id },
  });

  const dashboardRes = await getFacultyDashboardDataAction();

  if (!dashboardRes.success || !dashboardRes.data) {
    return (
      <div className="p-8 text-center text-sm text-red-500">
        Failed to load faculty portal data. {dashboardRes.error}
      </div>
    );
  }

  const { supervisedStudents, pendingStudentsCount, recentBookings, pendingLogs } =
    dashboardRes.data;

  type DashboardProps = React.ComponentProps<typeof FacultyDashboardClient>;

  return (
    <FacultyDashboardClient
      facultyName={session.user.name || "Faculty Member"}
      designation={facultyProfile?.designation || "Faculty Supervisor"}
      department={facultyProfile?.department || "Department of Biotechnology & Genetic Engineering"}
      stats={{
        studentsCount: supervisedStudents.length,
        pendingStudentsCount,
        pendingLogsCount: pendingLogs.length,
        bookingsCount: recentBookings.length,
      }}
      pendingLogs={pendingLogs as unknown as DashboardProps["pendingLogs"]}
      recentBookings={recentBookings as unknown as DashboardProps["recentBookings"]}
    />
  );
}
