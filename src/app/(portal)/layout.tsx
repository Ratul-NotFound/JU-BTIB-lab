import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role, BookingStatus } from "@prisma/client";
import { PortalAppShell } from "@/components/portal/portal-app-shell";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  // Resolve verified DB user (handles stale session cookies safely)
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

  const targetUserId = dbUser.id;

  let studentProfile = null;
  let facultyProfile = null;

  const stats = {
    totalHours: 0,
    upcomingBookingsCount: 0,
    totalLogsCount: 0,
    supervisedStudentsCount: 0,
    pendingVerificationsCount: 0,
  };

  // If user is a student / scholar or testing as admin
  if (dbUser.role === Role.STUDENT || dbUser.role === Role.SUPER_ADMIN || dbUser.role === Role.EDITOR) {
    studentProfile = await db.studentProfile.findUnique({
      where: { userId: targetUserId },
      include: {
        supervisor: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
        bookings: {
          where: {
            endTime: { gte: new Date() },
            status: BookingStatus.CONFIRMED,
          },
          select: { id: true },
        },
        workLogs: {
          select: { actualHoursUsed: true },
        },
      },
    });

    if (studentProfile) {
      stats.totalHours = studentProfile.workLogs.reduce(
        (sum, log) => sum + log.actualHoursUsed,
        0
      );
      stats.upcomingBookingsCount = studentProfile.bookings.length;
      stats.totalLogsCount = studentProfile.workLogs.length;
    }
  }

  // If user is a faculty member
  if (dbUser.role === Role.FACULTY) {
    facultyProfile = await db.facultyProfile.findUnique({
      where: { userId: targetUserId },
      include: {
        supervisedStudents: {
          select: { id: true },
        },
      },
    });

    const pendingCount = await db.experimentLog.count({
      where: { verifiedBy: null },
    });

    stats.supervisedStudentsCount = facultyProfile?.supervisedStudents.length || 0;
    stats.pendingVerificationsCount = pendingCount;
  }

  // If user is admin, fetch system stats for quick badges
  if (session.user.role === Role.SUPER_ADMIN || session.user.role === Role.EDITOR) {
    const [studentsCount, pendingLogsCount] = await Promise.all([
      db.studentProfile.count(),
      db.experimentLog.count({ where: { verifiedBy: null } }),
    ]);
    stats.supervisedStudentsCount = studentsCount;
    stats.pendingVerificationsCount = pendingLogsCount;
  }

  return (
    <PortalAppShell
      user={session.user}
      studentProfile={studentProfile}
      facultyProfile={facultyProfile}
      stats={stats}
    >
      {children}
    </PortalAppShell>
  );
}
