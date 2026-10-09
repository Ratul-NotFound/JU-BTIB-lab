import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { BookEquipmentClient } from "./book-client";
import { AlertTriangle, Lock } from "lucide-react";
import Link from "next/link";
import { AccountStatus } from "@prisma/client";

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

  // Check student profile status
  const profile = await db.studentProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (profile && profile.status === AccountStatus.PENDING_APPROVAL) {
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
            Your scholar account is currently being reviewed by the lab administrator or your assigned faculty supervisor. Once approved, you will be able to book lab instruments.
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

  if (profile && profile.status === AccountStatus.SUSPENDED) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto">
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

  // Fetch all published equipment
  const equipment = await db.equipment.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
      imageUrl: true,
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <BookEquipmentClient equipmentList={equipment} />
    </div>
  );
}
