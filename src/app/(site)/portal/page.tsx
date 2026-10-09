import * as React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role, AccountStatus, BookingStatus } from "@prisma/client";
import {
  GraduationCap,
  Microscope,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  FileText,
  User,
  PlusCircle,
} from "lucide-react";

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

  // Redirect Faculty to their dedicated portal
  if (session.user.role === Role.FACULTY) {
    redirect("/faculty");
  }

  // Fetch Student Profile & associated bookings and logs
  const profile = await db.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      supervisor: { include: { user: { select: { name: true, email: true } } } },
      bookings: {
        include: { equipment: { select: { name: true, category: true, imageUrl: true } } },
        orderBy: { startTime: "desc" },
        take: 5,
      },
      workLogs: {
        include: { equipment: { select: { name: true } } },
        orderBy: { dateConducted: "desc" },
        take: 5,
      },
    },
  });

  const isPending = profile?.status === AccountStatus.PENDING_APPROVAL;
  const isRejected = profile?.status === AccountStatus.REJECTED;

  // Calculate cumulative stats
  const totalHours = profile?.workLogs?.reduce((sum, log) => sum + log.actualHoursUsed, 0) || 0;
  const upcomingBookings =
    profile?.bookings?.filter(
      (b) => new Date(b.endTime) >= new Date() && b.status === BookingStatus.CONFIRMED
    ) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 space-y-8">
      {/* 1. Header Banner & Welcome */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>BTIB Scholar Portal</span>
            </span>
            {isPending && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Verification Pending</span>
              </span>
            )}
            {!isPending && !isRejected && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Scholar</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[var(--text-primary)]">
            Welcome back, {session.user.name}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
            {profile?.program?.replace("_", " ")} · Student ID: {profile?.studentId || "N/A"} · Supervisor:{" "}
            <span className="font-medium text-[var(--text-primary)]">
              {profile?.supervisor ? profile.supervisor.user.name : profile?.supervisorName || "Assigned Faculty"}
            </span>
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 shrink-0 relative z-10">
          {!isPending && (
            <Link
              href="/portal/book"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book Instrument</span>
            </Link>
          )}
          <Link
            href="/portal/history"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-semibold bg-[var(--surface-raised)] hover:bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] transition-all shadow-xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>My Logbook</span>
          </Link>
        </div>
      </div>

      {/* 2. Verification Alert Banner if Pending */}
      {isPending && (
        <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-xs sm:text-sm text-amber-800 dark:text-amber-200 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Account Awaiting Faculty Verification</span>
            <p className="font-light leading-relaxed text-xs">
              Your registration has been submitted and is currently being reviewed by your assigned thesis supervisor or lab administration. Instrument reservations and experiment logging will unlock automatically as soon as your account is approved.
            </p>
          </div>
        </div>
      )}

      {/* 3. Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <span>Upcoming Reservations</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-sans text-[var(--text-primary)]">
            {upcomingBookings.length}
          </div>
          <span className="text-[11px] text-[var(--text-muted)] block">Confirmed slots in queue</span>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <span>Cumulative Machine Time</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-sans text-[var(--text-primary)]">
            {Math.round(totalHours * 10) / 10} <span className="text-base font-normal text-[var(--text-muted)]">hrs</span>
          </div>
          <span className="text-[11px] text-[var(--text-muted)] block">Logged in research logbook</span>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <span>Experiments Conducted</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-sans text-[var(--text-primary)]">
            {profile?.workLogs?.length || 0}
          </div>
          <span className="text-[11px] text-[var(--text-muted)] block">Documented thesis records</span>
        </div>
      </div>

      {/* 4. Upcoming Bookings & Active Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black font-sans text-[var(--text-primary)] flex items-center gap-2">
              <Microscope className="w-5 h-5 text-emerald-500" />
              <span>Upcoming & Active Reservations</span>
            </h2>
            <Link href="/portal/book" className="text-xs font-bold text-[var(--brand-primary)] hover:underline">
              New Booking →
            </Link>
          </div>

          {upcomingBookings.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] text-center text-xs text-[var(--text-muted)] space-y-3">
              <Calendar className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
              <div>
                <span className="font-semibold block text-[var(--text-secondary)]">No upcoming reservations</span>
                <span>You do not have any active instrument bookings scheduled right now.</span>
              </div>
              {!isPending && (
                <Link
                  href="/portal/book"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--surface-raised)] hover:bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Reserve an Instrument Now</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-emerald-500/40 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[var(--text-primary)]">{b.equipment.name}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {b.status}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] font-light">Purpose: {b.purpose}</p>
                    <div className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-3 pt-1">
                      <span>📅 {new Date(b.startTime).toLocaleDateString()}</span>
                      <span>
                        ⏰ {new Date(b.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                        {new Date(b.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/portal/history`}
                    className="shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[var(--surface-raised)] hover:bg-[var(--brand-primary)] hover:text-white text-[var(--text-secondary)] border border-[var(--border)] transition-all text-center"
                  >
                    Log Results
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Quick Researcher Profile Card */}
        <div className="space-y-4">
          <h2 className="text-lg font-black font-sans text-[var(--text-primary)] flex items-center gap-2">
            <User className="w-5 h-5 text-sky-500" />
            <span>Academic Profile</span>
          </h2>

          <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4 text-xs">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[var(--text-muted)] block uppercase">Research Topic</span>
              <p className="font-medium text-[var(--text-primary)] leading-relaxed">
                {profile?.thesisTitle || "Microbial Bioproducts and Bioprocess Kinetics"}
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border)] space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Department:</span>
                <span className="text-[var(--text-primary)] text-right">BGE, JU</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Session:</span>
                <span className="text-[var(--text-primary)]">{profile?.sessionYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Batch:</span>
                <span className="text-[var(--text-primary)]">{profile?.batch || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Contact:</span>
                <span className="text-[var(--text-primary)]">{profile?.phone}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)]">
              <Link
                href="/portal/history"
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[var(--surface-raised)] hover:bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Full Thesis Logbook</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
