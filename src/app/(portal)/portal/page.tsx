import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role, AccountStatus } from "@prisma/client";
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

  // Redirect Faculty to their dedicated portal
  if (dbUser.role === Role.FACULTY) {
    redirect("/faculty");
  }

  // Fetch Student Profile & associated bookings and logs
  let profile = await db.studentProfile.findUnique({
    where: { userId: targetUserId },
    include: {
      supervisor: { include: { user: { select: { name: true, email: true } } } },
      bookings: {
        include: {
          equipment: { select: { id: true, name: true, category: true, imageUrl: true } },
          experimentLog: {
            select: {
              id: true,
              title: true,
              actualHoursUsed: true,
              protocolSummary: true,
              observations: true,
              verifiedBy: true,
              verifiedAt: true,
            },
          },
        },
        orderBy: { startTime: "desc" },
      },
      workLogs: {
        select: { actualHoursUsed: true },
      },
    },
  });

  // If user is Admin or Super Admin and has no student profile yet,
  // auto-provision an active scholar profile so they can test/use scholar features
  if (!profile && (dbUser.role === Role.SUPER_ADMIN || dbUser.role === Role.EDITOR)) {
    try {
      const faculty = await db.facultyProfile.findFirst();
      profile = await db.studentProfile.upsert({
        where: { userId: targetUserId },
        create: {
          userId: targetUserId,
          studentId: "ADM-" + targetUserId.slice(-6).toUpperCase(),
          program: "PHD",
          department: "Department of Biotechnology & Genetic Engineering",
          institution: "Jahangirnagar University",
          sessionYear: "2023-2024",
          batch: "Lead Investigator",
          phone: "+880 1700-000000",
          supervisorId: faculty?.id || null,
          status: AccountStatus.ACTIVE,
          thesisTitle: "Advanced Bioprocess Engineering & Lab Instrumentation",
        },
        update: {},
        include: {
          supervisor: { include: { user: { select: { name: true, email: true } } } },
          bookings: {
            include: {
              equipment: { select: { id: true, name: true, category: true, imageUrl: true } },
              experimentLog: {
                select: {
                  id: true,
                  title: true,
                  actualHoursUsed: true,
                  protocolSummary: true,
                  observations: true,
                  verifiedBy: true,
                  verifiedAt: true,
                },
              },
            },
            orderBy: { startTime: "desc" },
          },
          workLogs: {
            select: { actualHoursUsed: true },
          },
        },
      });
    } catch (err) {
      console.error("Auto provision student profile error:", err);
    }
  }

  const isPending = profile?.status === AccountStatus.PENDING_APPROVAL;
  const isRejected = profile?.status === AccountStatus.REJECTED;

  // Calculate cumulative stats
  const totalHours = profile?.workLogs?.reduce((sum, log) => sum + log.actualHoursUsed, 0) || 0;

  // Active notices for student role
  const noticesRes = await getActivePortalNoticesAction(dbUser.role);
  const notices = noticesRes.success && noticesRes.data ? noticesRes.data : [];

  return (
    <ScholarDashboardClient
      userName={session.user.name || "Scholar"}
      userEmail={session.user.email || ""}
      profile={profile}
      isPending={isPending}
      isRejected={isRejected}
      totalHours={totalHours}
      bookings={profile?.bookings || []}
      notices={notices}
    />
  );
}

