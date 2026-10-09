"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { verifyExperimentLogAction } from "@/server/actions/experiment-log";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileCheck2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  UserCheck,
} from "lucide-react";

interface PendingLog {
  id: string;
  title: string;
  actualHoursUsed: number;
  dateConducted: string | Date;
  protocolSummary: string;
  equipment: { name: string };
  studentProfile: {
    studentId: string;
    program: string;
    user: { name: string | null; email: string };
  };
}

interface RecentBooking {
  id: string;
  startTime: string | Date;
  endTime: string | Date;
  purpose: string;
  status: string;
  equipment: { name: string; category: string };
  studentProfile: {
    studentId: string;
    user: { name: string | null };
  } | null;
}

interface FacultyDashboardProps {
  facultyName: string;
  designation: string;
  department: string;
  stats: {
    studentsCount: number;
    pendingStudentsCount: number;
    pendingLogsCount: number;
    bookingsCount: number;
  };
  pendingLogs: PendingLog[];
  recentBookings: RecentBooking[];
}

export function FacultyDashboardClient({
  facultyName,
  designation,
  department,
  stats,
  pendingLogs: initialPendingLogs,
  recentBookings,
}: FacultyDashboardProps) {
  const router = useRouter();
  const [pendingLogs, setPendingLogs] = React.useState<PendingLog[]>(initialPendingLogs);
  const [signingLogId, setSigningLogId] = React.useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = React.useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSignOff = async (logId: string) => {
    setSigningLogId(logId);
    setFeedbackMsg(null);
    try {
      const res = await verifyExperimentLogAction(logId);
      if (res.success) {
        setPendingLogs((prev) => prev.filter((l) => l.id !== logId));
        setFeedbackMsg({ text: "Experiment log verified and signed off.", type: "success" });
        router.refresh();
      } else {
        setFeedbackMsg({ text: res.error || "Failed to sign off.", type: "error" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error occurred.";
      setFeedbackMsg({ text: msg, type: "error" });
    } finally {
      setSigningLogId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-mono font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Lab Academic Supervisor</span>
            </span>
            <span className="text-xs text-[var(--text-secondary)] font-mono">
              {designation}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[var(--text-primary)]">
            Welcome, {facultyName}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-light">
            {department} · Jahangirnagar University
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/faculty/activity"
            className="px-4 py-2.5 rounded-md text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 shadow-xs transition-colors"
          >
            <span>Activity Tracer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/faculty/students"
            className="px-4 py-2.5 rounded-md text-xs font-semibold bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-primary)] hover:border-purple-500/50 flex items-center gap-2 transition-colors"
          >
            <span>Supervised Scholars</span>
          </Link>
        </div>
      </div>

      {/* 2. Analytical Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-md border border-[var(--border)] bg-[var(--surface)] flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">
              Supervised Scholars
            </div>
            <div className="text-2xl font-black font-sans text-[var(--text-primary)]">
              {stats.studentsCount}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-md border border-[var(--border)] bg-[var(--surface)] flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">
              Pending Registrations
            </div>
            <div className="text-2xl font-black font-sans text-[var(--text-primary)]">
              {stats.pendingStudentsCount}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-md border border-[var(--border)] bg-[var(--surface)] flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">
              Logs Awaiting Sign-off
            </div>
            <div className="text-2xl font-black font-sans text-[var(--text-primary)]">
              {pendingLogs.length}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-md border border-[var(--border)] bg-[var(--surface)] flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">
              Active Bookings
            </div>
            <div className="text-2xl font-black font-sans text-[var(--text-primary)]">
              {stats.bookingsCount}
            </div>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-md border text-sm flex items-center gap-3 ${
            feedbackMsg.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
              : "bg-red-500/10 border-red-500/20 text-red-600"
          }`}
        >
          {feedbackMsg.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* 3. Section: Pending Experiment Log Sign-offs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-sans text-[var(--text-primary)] flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-purple-500" />
              <span>Experiment Logs Requiring Supervisor Verification</span>
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Review research methodology and certify instrument operating hours for your supervised scholars.
            </p>
          </div>
          <Link
            href="/faculty/activity"
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            <span>View All Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingLogs.length === 0 ? (
          <div className="p-8 text-center rounded-md border border-[var(--border)] bg-[var(--surface)] space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">All Logs Verified</p>
            <p className="text-xs text-[var(--text-secondary)]">
              There are no pending experiment logs requiring your signature at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingLogs.map((log) => {
              const conductedDate = new Date(log.dateConducted).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={log.id}
                  className="p-5 rounded-md border border-[var(--border)] bg-[var(--surface)] hover:border-purple-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-xs text-[var(--text-primary)]">
                        {log.studentProfile.user.name} ({log.studentProfile.studentId})
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-secondary)]">
                        {log.equipment.name}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold">
                        {log.actualHoursUsed} hrs
                      </span>
                      <span className="text-xs text-[var(--text-secondary)] font-mono">
                        {conductedDate}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold font-sans text-[var(--text-primary)]">
                      {log.title}
                    </h3>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {log.protocolSummary}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Button
                      onClick={() => handleSignOff(log.id)}
                      disabled={signingLogId === log.id}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 py-2 rounded-md font-medium flex items-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{signingLogId === log.id ? "Signing..." : "Sign Off & Verify"}</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Section: Recent Equipment Bookings by Scholars */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-sans text-[var(--text-primary)] flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-500" />
          <span>Recent Instrument Reservations</span>
        </h2>

        {recentBookings.length === 0 ? (
          <div className="p-8 text-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-secondary)]">
            No equipment bookings recorded yet.
          </div>
        ) : (
          <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]/50 text-[var(--text-secondary)] font-mono uppercase tracking-wider">
                    <th className="p-3.5 pl-5">Scholar</th>
                    <th className="p-3.5">Instrument</th>
                    <th className="p-3.5">Scheduled Slot</th>
                    <th className="p-3.5">Purpose</th>
                    <th className="p-3.5 pr-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {recentBookings.map((b) => {
                    const start = new Date(b.startTime);
                    const end = new Date(b.endTime);

                    return (
                      <tr key={b.id} className="hover:bg-[var(--surface-raised)]/30 transition-colors">
                        <td className="p-3.5 pl-5 font-semibold text-[var(--text-primary)]">
                          {b.studentProfile?.user?.name || "Scholar"}
                          <div className="text-[11px] font-mono text-[var(--text-secondary)]">
                            {b.studentProfile?.studentId}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="font-medium text-[var(--text-primary)]">
                            {b.equipment.name}
                          </span>
                          <div className="text-[11px] text-[var(--text-secondary)]">
                            {b.equipment.category}
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-[var(--text-secondary)]">
                          {start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          <div className="text-[11px]">
                            {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                            {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </td>
                        <td className="p-3.5 text-[var(--text-secondary)] max-w-xs truncate">
                          {b.purpose}
                        </td>
                        <td className="p-3.5 pr-5">
                          <span className="px-2.5 py-1 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
