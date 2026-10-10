import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { StudentHistoryClient } from "./history-client";
import { AccountStatus, Role } from "@prisma/client";
import Link from "next/link";
import { AlertTriangle, UserCheck } from "lucide-react";
import { getPortalData } from "@/server/queries/portal";
import { getEquipmentList } from "@/server/queries/equipment";

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

  // portalData is already memoized in memory by PortalLayout (0ms duplicate cost)
  const portalData = await getPortalData(session.user.id, session.user.email);

  if (!portalData) {
    redirect("/login");
  }

  // Redirect Faculty to their dedicated verification queue
  if (portalData.user.role === Role.FACULTY) {
    redirect("/faculty/activity");
  }

  const profile = portalData.studentProfile;

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
          <UserCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-sans text-[var(--text-primary)]">
            Scholar Registration Incomplete
          </h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
            You do not currently have a registered scholar record to attach experimental logbooks to. Please complete your scholar registration or check your portal clearance.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link
            href="/portal"
            className="px-5 py-2.5 rounded-md text-xs font-semibold bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-primary)] hover:border-emerald-500/50 transition-all"
          >
            Return to Scholar Portal
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-md text-xs font-semibold bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] transition-all"
          >
            Register Scholar Account
          </Link>
        </div>
      </div>
    );
  }

  if (profile.status === AccountStatus.PENDING_APPROVAL) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
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
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-md text-xs font-semibold bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-primary)] hover:border-emerald-500/50 transition-all"
          >
            Return to Scholar Portal
          </Link>
        </div>
      </div>
    );
  }

  // Fetch cached equipment list and detailed work logs in parallel
  const [equipment, workLogs] = await Promise.all([
    getEquipmentList(),
    db.experimentLog.findMany({
      where: { studentProfileId: profile.id },
      include: {
        equipment: { select: { name: true, category: true } },
        faculty: { include: { user: { select: { name: true } } } },
      },
      orderBy: { dateConducted: "desc" },
    }),
  ]);

  const totalHours = workLogs.reduce((sum, log) => sum + log.actualHoursUsed, 0);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <StudentHistoryClient
        initialLogs={workLogs}
        totalHours={Math.round(totalHours * 10) / 10}
        equipmentList={equipment}
        studentName={session.user.name || portalData.user.name || "Scholar"}
        studentId={profile.studentId}
        program={profile.program}
        supervisorName={profile.supervisor?.user?.name || profile.supervisorName || "Assigned Faculty"}
      />
    </div>
  );
}
