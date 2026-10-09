import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AccountStatus } from "@prisma/client";
import {
  User,
  GraduationCap,
  Mail,
  Building,
  Award,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ShieldCheck,
  Clock,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Scholar Profile & Supervision | BTIB Portal",
  description: "View verified academic registration, thesis supervision, and lab clearance status.",
};

export default async function ScholarProfilePage() {
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

  // Fetch Student Profile
  const profile = await db.studentProfile.findUnique({
    where: { userId: dbUser.id },
    include: {
      supervisor: {
        include: {
          user: { select: { name: true, email: true } },
        },
      },
      workLogs: {
        select: { actualHoursUsed: true },
      },
      bookings: {
        select: { id: true },
      },
    },
  });

  const isPending = profile?.status === AccountStatus.PENDING_APPROVAL;
  const isSuspended = profile?.status === AccountStatus.SUSPENDED;
  const totalHours = profile?.workLogs?.reduce((sum, log) => sum + log.actualHoursUsed, 0) || 0;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Scholar Registration Dossier</span>
            </span>
            {isPending ? (
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Verification Pending</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active Scholar Clearance</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[var(--text-primary)]">
            {session.user.name}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
            Department of Biotechnology &amp; Genetic Engineering · Jahangirnagar University, Savar, Dhaka.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/portal/history"
            className="px-4 py-2.5 rounded-md text-xs font-semibold bg-[var(--surface-raised)] hover:bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] transition-all shadow-xs flex items-center gap-2"
          >
            <Clock className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
            <span>{Math.round(totalHours * 10) / 10} hrs Documented</span>
          </Link>
        </div>
      </div>

      {/* 2. Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Academic Registration */}
        <div className="p-6 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
            <GraduationCap className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-bold font-sans text-[var(--text-primary)]">
              Academic Registration
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[var(--border)]/50">
              <span className="text-[var(--text-muted)] font-mono">JU Student ID / Roll:</span>
              <span className="font-bold text-[var(--text-primary)] font-mono">
                {profile?.studentId || "N/A"}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[var(--border)]/50">
              <span className="text-[var(--text-muted)] font-mono">Degree Program:</span>
              <span className="font-semibold text-[var(--brand-primary)]">
                {profile?.program ? profile.program.replace("_", " ") : "B.Sc. Thesis Scholar"}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[var(--border)]/50">
              <span className="text-[var(--text-muted)] font-mono">Department:</span>
              <span className="text-[var(--text-primary)]">Biotechnology &amp; Genetic Engineering</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[var(--border)]/50">
              <span className="text-[var(--text-muted)] font-mono">Institution:</span>
              <span className="text-[var(--text-primary)]">Jahangirnagar University</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[var(--border)]/50">
              <span className="text-[var(--text-muted)] font-mono">Academic Session:</span>
              <span className="font-mono text-[var(--text-primary)]">{profile?.sessionYear || "2020-2021"}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[var(--border)]/50">
              <span className="text-[var(--text-muted)] font-mono">Batch:</span>
              <span className="text-[var(--text-primary)]">{profile?.batch || "N/A"}</span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-[var(--text-muted)] font-mono">Registered Email:</span>
              <span className="text-[var(--text-primary)] truncate max-w-[200px]">{session.user.email}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Research Thesis & Lab Focus */}
        <div className="p-6 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
            <BookOpen className="w-4 h-4 text-[var(--bio-teal)]" />
            <h2 className="text-sm font-bold font-sans text-[var(--text-primary)]">
              Research Thesis &amp; Scope
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block mb-1">
                Thesis Title / Research Topic:
              </span>
              <p className="font-semibold text-[var(--text-primary)] text-sm leading-relaxed p-3 rounded-md bg-[var(--surface-raised)]/60 border border-[var(--border)]">
                {profile?.thesisTitle || "Bioprocess Kinetics & Microbial Bioproduct Engineering"}
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                Primary Experimental Suites:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded text-[11px] bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-secondary)]">
                  Photobioreactor Analytics
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-secondary)]">
                  Stirred-Tank Fermentation
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-secondary)]">
                  Enzyme Biocatalysis
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-[var(--border)]/50">
              <span className="text-[var(--text-muted)] font-mono">Contact Phone:</span>
              <span className="font-mono text-[var(--text-primary)]">{profile?.phone || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Assigned Thesis Supervisor */}
        <div className="p-6 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
            <Award className="w-4 h-4 text-purple-500" />
            <h2 className="text-sm font-bold font-sans text-[var(--text-primary)]">
              Assigned Thesis Supervisor
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-md bg-[var(--surface-raised)]/60 border border-[var(--border)] space-y-1">
              <span className="font-bold text-sm text-[var(--text-primary)] block">
                {profile?.supervisor ? profile.supervisor.user.name : profile?.supervisorName || "Assigned Faculty Member"}
              </span>
              <span className="text-[11px] text-[var(--text-muted)] block">
                {profile?.supervisor?.designation || "Professor"} · Department of BGE, JU
              </span>
            </div>

            {profile?.supervisor?.user?.email && (
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--border)]/50">
                <span className="text-[var(--text-muted)] font-mono flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Supervisor Email:</span>
                </span>
                <a
                  href={`mailto:${profile.supervisor.user.email}`}
                  className="text-[var(--brand-primary)] hover:underline font-mono"
                >
                  {profile.supervisor.user.email}
                </a>
              </div>
            )}

            {profile?.supervisor?.officeRoom && (
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--border)]/50">
                <span className="text-[var(--text-muted)] font-mono flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Office Room:</span>
                </span>
                <span className="text-[var(--text-primary)] font-mono">
                  {profile.supervisor.officeRoom}
                </span>
              </div>
            )}

            <div className="pt-2 text-[11px] text-[var(--text-muted)] leading-relaxed">
              All experiment logs submitted to your thesis logbook require digital verification by your supervisor before final thesis submission.
            </div>
          </div>
        </div>

        {/* Card 4: Laboratory Access & Clearance Tier */}
        <div className="p-6 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-bold font-sans text-[var(--text-primary)]">
              Access Clearance &amp; Rules
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-3 rounded-md bg-[var(--surface-raised)] border border-[var(--border)]">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                  Access Status
                </span>
                <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {isPending ? "Pending Verification" : isSuspended ? "Suspended" : "Authorized"}
                </span>
              </div>

              <div className="p-3 rounded-md bg-[var(--surface-raised)] border border-[var(--border)]">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                  Safety Level
                </span>
                <span className="font-bold text-xs text-[var(--text-primary)] mt-0.5 block">
                  BSL-1 &amp; BSL-2
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-md bg-[var(--surface-raised)]/40 border border-[var(--border)] space-y-1.5">
              <span className="font-semibold text-xs text-[var(--text-primary)] block">
                Lab Safety Compliance
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] font-light leading-relaxed">
                Scholars must wear lab coats, safety goggles, and nitrile gloves when operating benchtop fermenters and autoclaves. Clean workstations after each session.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link
                href="/portal/sops"
                className="text-xs font-semibold text-[var(--brand-primary)] hover:underline inline-flex items-center gap-1"
              >
                <span>Read Full Laboratory SOPs &amp; Guidelines →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
