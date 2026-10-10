import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { BookEquipmentClient } from "./book-client";
import { AlertTriangle, Lock } from "lucide-react";
import Link from "next/link";
import { AccountStatus } from "@prisma/client";
import { getPortalData } from "@/server/queries/portal";
import { getEquipmentList } from "@/server/queries/equipment";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Book Equipment | BTIB Lab Portal",
  description: "Instant instrument booking with automated real-time conflict checking.",
};

export default async function BookEquipmentPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch portal data and cached equipment list in parallel.
  // portalData is already memoized in memory by PortalLayout (0ms duplicate cost).
  // getEquipmentList() is served from next/cache unstable_cache (0ms).
  const [portalData, equipment] = await Promise.all([
    getPortalData(session.user.id, session.user.email),
    getEquipmentList(),
  ]);

  if (!portalData) {
    redirect("/login");
  }

  const profile = portalData.studentProfile;

  if (profile && profile.status === AccountStatus.PENDING_APPROVAL) {
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
            Your scholar account is currently being reviewed by the lab administrator or your assigned faculty supervisor. Once approved, you will be able to book lab instruments.
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

  if (profile && profile.status === AccountStatus.SUSPENDED) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-sans text-[var(--text-primary)]">
            Access Suspended
          </h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            Your lab access privileges have been temporarily restricted. Please contact the lab supervisor or administration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <BookEquipmentClient equipmentList={equipment} />
    </div>
  );
}
