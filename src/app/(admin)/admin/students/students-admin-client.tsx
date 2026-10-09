"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { approveStudentAction, rejectStudentAction } from "@/server/actions/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  UserX,
  Filter,
  Check,
  Sparkles,
} from "lucide-react";

interface StudentRecord {
  id: string;
  studentId: string;
  program: string;
  sessionYear: string;
  batch: string | null;
  phone: string;
  thesisTitle: string | null;
  status: string;
  rejectionReason: string | null;
  createdAt: string | Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    createdAt: string | Date;
  };
  supervisor?: {
    user: {
      name: string | null;
    };
  } | null;
  supervisorName?: string | null;
  _count: {
    bookings: number;
    workLogs: number;
  };
}

interface StudentsAdminClientProps {
  initialStudents: StudentRecord[];
}

export function StudentsAdminClient({ initialStudents }: StudentsAdminClientProps) {
  const router = useRouter();
  const [students, setStudents] = React.useState<StudentRecord[]>(initialStudents);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | "PENDING_APPROVAL" | "ACTIVE" | "REJECTED">("ALL");
  const [processingId, setProcessingId] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    setFeedback(null);
    try {
      const res = await approveStudentAction(id);
      if (res.success) {
        setStudents((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: "ACTIVE" } : s))
        );
        setFeedback({ text: "Scholar registration approved successfully.", type: "success" });
        router.refresh();
      } else {
        setFeedback({ text: res.error || "Approval failed.", type: "error" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error occurred.";
      setFeedback({ text: msg, type: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt("Reason for rejection / required correction:");
    if (!reason) return;

    setProcessingId(id);
    setFeedback(null);
    try {
      const res = await rejectStudentAction(id, reason);
      if (res.success) {
        setStudents((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: "REJECTED", rejectionReason: reason } : s))
        );
        setFeedback({ text: "Scholar marked as rejected.", type: "success" });
        router.refresh();
      } else {
        setFeedback({ text: res.error || "Rejection failed.", type: "error" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error occurred.";
      setFeedback({ text: msg, type: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  const pendingStudents = students.filter((s) => s.status === "PENDING_APPROVAL");

  const filteredStudents = students.filter((s) => {
    if (statusFilter !== "ALL" && s.status !== statusFilter) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = s.user.name?.toLowerCase() || "";
    const roll = s.studentId.toLowerCase();
    const email = s.user.email.toLowerCase();
    const supervisor = (s.supervisor?.user?.name || s.supervisorName || "").toLowerCase();
    const thesis = s.thesisTitle?.toLowerCase() || "";

    return name.includes(q) || roll.includes(q) || email.includes(q) || supervisor.includes(q) || thesis.includes(q);
  });

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="specimen-tag text-[10px] py-0 px-2 font-bold uppercase">
              Student Identity & Verification
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              {students.length} Total Scholars ({pendingStudents.length} Pending Approval)
            </span>
          </div>

          <h1 className="text-2xl font-bold font-sans tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-600" />
            <span>Student Scholars & Approval Queue</span>
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-light">
            Manage student registrations, academic credentials verification, and instrument booking access.
          </p>
        </div>

        {pendingStudents.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center gap-2.5 shrink-0">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div className="text-xs font-medium">
              <span className="font-bold">{pendingStudents.length} scholar(s)</span> await verification.
            </div>
          </div>
        )}
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-center gap-3 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
              : "bg-red-500/10 border-red-500/20 text-red-600"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* 2. Pending Approval Queue Section */}
      {pendingStudents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold font-sans text-[var(--text-primary)]">
              Awaiting Verification Queue ({pendingStudents.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingStudents.map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-2xl border border-amber-500/30 bg-[var(--surface)] hover:border-amber-500/50 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">
                      {s.user.name}
                    </h3>
                    <div className="text-xs font-mono text-[var(--text-secondary)]">
                      ID: {s.studentId} · {s.program.replace("_", " ")}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    PENDING APPROVAL
                  </span>
                </div>

                <div className="text-xs text-[var(--text-secondary)] space-y-1 bg-[var(--surface-raised)]/60 p-3 rounded-xl border border-[var(--border)]">
                  <div>
                    <span className="font-semibold text-[var(--text-primary)]">Supervisor: </span>
                    {s.supervisor?.user?.name || s.supervisorName || "Not assigned"}
                  </div>
                  <div>
                    <span className="font-semibold text-[var(--text-primary)]">Session: </span>
                    {s.sessionYear} {s.batch ? `(${s.batch})` : ""}
                  </div>
                  {s.thesisTitle && (
                    <div>
                      <span className="font-semibold text-[var(--text-primary)]">Thesis: </span>
                      <span className="italic">{s.thesisTitle}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border)]">
                  <div className="text-[11px] font-mono text-[var(--text-secondary)]">
                    {s.user.email} · {s.phone}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(s.id)}
                      disabled={processingId === s.id}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3.5 h-8 rounded-full"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      <span>Approve</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(s.id)}
                      disabled={processingId === s.id}
                      className="text-xs px-2.5 h-8 rounded-full text-red-600 border-red-500/20 hover:bg-red-500/10"
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Search & Filter Bar */}
      <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <Input
            type="text"
            placeholder="Search scholar name, roll, email, supervisor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-xs bg-[var(--surface-raised)] border-[var(--border)]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-[var(--text-secondary)] font-mono flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </span>
          <div className="flex items-center gap-1">
            {(["ALL", "ACTIVE", "PENDING_APPROVAL", "REJECTED"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                  statusFilter === filter
                    ? "bg-[var(--text-primary)] text-[var(--background)] font-bold shadow-xs"
                    : "bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]"
                }`}
              >
                {filter === "ALL"
                  ? "All"
                  : filter === "PENDING_APPROVAL"
                  ? "Pending"
                  : filter === "ACTIVE"
                  ? "Active"
                  : "Rejected"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Complete Students Table */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold font-sans text-[var(--text-primary)]">
          Scholar Roster
        </h2>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-secondary)]">
            No scholars match your current search and filters.
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]/50 text-[var(--text-secondary)] font-mono uppercase tracking-wider">
                    <th className="p-3.5 pl-5">Scholar</th>
                    <th className="p-3.5">Student ID & Program</th>
                    <th className="p-3.5">Supervisor</th>
                    <th className="p-3.5">Session / Batch</th>
                    <th className="p-3.5">Activity</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 pr-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredStudents.map((s) => {
                    const isPending = s.status === "PENDING_APPROVAL";
                    const isRejected = s.status === "REJECTED";

                    return (
                      <tr key={s.id} className="hover:bg-[var(--surface-raised)]/30 transition-colors">
                        <td className="p-3.5 pl-5">
                          <div className="font-bold text-sm text-[var(--text-primary)]">
                            {s.user.name}
                          </div>
                          <div className="text-[11px] font-mono text-[var(--text-secondary)]">
                            {s.user.email} · {s.phone}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="font-mono font-semibold text-[var(--text-primary)]">
                            {s.studentId}
                          </span>
                          <div className="text-[11px] text-[var(--text-secondary)]">
                            {s.program.replace("_", " ")}
                          </div>
                        </td>
                        <td className="p-3.5 text-[var(--text-primary)]">
                          {s.supervisor?.user?.name || s.supervisorName || "—"}
                        </td>
                        <td className="p-3.5 font-mono text-[var(--text-secondary)]">
                          {s.sessionYear} {s.batch ? `(${s.batch})` : ""}
                        </td>
                        <td className="p-3.5">
                          <div className="text-[11px] font-mono text-[var(--text-secondary)]">
                            {s._count.bookings} bookings · {s._count.workLogs} logs
                          </div>
                        </td>
                        <td className="p-3.5">
                          {isPending && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              PENDING
                            </span>
                          )}
                          {!isPending && !isRejected && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              ACTIVE
                            </span>
                          )}
                          {isRejected && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                              REJECTED
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 pr-5">
                          {isPending ? (
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(s.id)}
                                disabled={processingId === s.id}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-7 px-2.5 rounded-full"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(s.id)}
                                disabled={processingId === s.id}
                                className="text-[11px] h-7 px-2 rounded-full text-red-600 border-red-500/20"
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-[var(--text-muted)]">—</span>
                          )}
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
