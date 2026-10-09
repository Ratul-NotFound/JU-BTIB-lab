import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { StudentHistoryClient } from "./history-client";
import { AccountStatus } from "@prisma/client";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Experimental Logbook & Work History | BTIB Scholar Portal",
  description: "Official record of experimental protocols, instrument operating hours, and supervisor sign-offs.",
};

export default async function StudentHistoryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch student profile
  const profile = await db.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      supervisor: { include: { user: { select: { name: true } } } },
      workLogs: {
        include: {
          equipment: { select: { name: true, category: true } },
          faculty: { include: { user: { select: { name: true } } } },
        },
        orderBy: { dateConducted: "desc" },
      },
    },
  });

  if (!profile) {
    redirect("/portal");
  }

  if (profile.status === AccountStatus.PENDING_APPROVAL) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-sans text-[var(--text-primary)]">
            Account Approval Pending
          </h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            Your scholar account is pending verification. Once approved, you can record and maintain your research logbook.
          </p>
        </div>
        <div>
          <Link
            href="/portal"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-semibold bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-primary)] hover:border-emerald-500/50 transition-all"
          >
            Return to Scholar Portal
          </Link>
        </div>
      </div>
    );
  }

  // Equipment options for dropdown
  const equipment = await db.equipment.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    select: {
      id: true,
      name: true,
      category: true,
    },
  });

  const totalHours = profile.workLogs.reduce((sum, log) => sum + log.actualHoursUsed, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <StudentHistoryClient
        initialLogs={profile.workLogs}
        totalHours={Math.round(totalHours * 10) / 10}
        equipmentList={equipment}
        studentName={session.user.name || "Scholar"}
        studentId={profile.studentId}
        program={profile.program}
        supervisorName={profile.supervisor?.user?.name || profile.supervisorName || "Assigned Faculty"}
      />
    </div>
  );
}
