"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { approveStudentAction, rejectStudentAction } from "@/server/actions/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  CheckCircle2,
  Phone,
  Mail,
  AlertTriangle,
  UserCheck,
  UserX,
} from "lucide-react";

interface SupervisedStudent {
  id: string;
  studentId: string;
  program: string;
  sessionYear: string;
  batch: string | null;
  phone: string;
  thesisTitle: string | null;
  status: string;
  createdAt: string | Date;
  user: {
    name: string | null;
    email: string;
  };
  workLogs: {
    actualHoursUsed: number;
    verifiedAt: string | Date | null;
  }[];
}

interface FacultyStudentsProps {
  students: SupervisedStudent[];
}

export function FacultyStudentsClient({ students: initialStudents }: FacultyStudentsProps) {
  const router = useRouter();
  const [students, setStudents] = React.useState<SupervisedStudent[]>(initialStudents);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [processingId, setProcessingId] = React.useState<string | null>(null);
  const [statusMessage, setStatusMessage] = React.useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleApprove = async (studentId: string) => {
    setProcessingId(studentId);
    setStatusMessage(null);
    try {
      const res = await approveStudentAction(studentId);
      if (res.success) {
        setStudents((prev) =>
          prev.map((s) => (s.id === studentId ? { ...s, status: "ACTIVE" } : s))
        );
        setStatusMessage({ text: "Scholar account approved successfully.", type: "success" });
        router.refresh();
      } else {
        setStatusMessage({ text: res.error || "Failed to approve scholar.", type: "error" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error occurred.";
      setStatusMessage({ text: msg, type: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (studentId: string) => {
    const reason = window.prompt("Reason for rejecting or requiring registration correction:");
    if (!reason) return;

    setProcessingId(studentId);
    setStatusMessage(null);
    try {
      const res = await rejectStudentAction(studentId, reason);
      if (res.success) {
        setStudents((prev) =>
          prev.map((s) => (s.id === studentId ? { ...s, status: "REJECTED" } : s))
        );
        setStatusMessage({ text: "Scholar registration marked as rejected.", type: "success" });
        router.refresh();
      } else {
        setStatusMessage({ text: res.error || "Failed to reject scholar.", type: "error" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error occurred.";
      setStatusMessage({ text: msg, type: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  const filteredStudents = students.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = s.user.name?.toLowerCase() || "";
    const id = s.studentId.toLowerCase();
    const email = s.user.email.toLowerCase();
    const thesis = s.thesisTitle?.toLowerCase() || "";

    return name.includes(q) || id.includes(q) || email.includes(q) || thesis.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Academic Supervision</span>
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              {students.length} Scholars Enrolled
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[var(--text-primary)]">
            Supervised Research Scholars
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-light">
            Directory of undergraduate, master&apos;s, and doctoral researchers conducting thesis experiments under your academic supervision.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <Input
            type="text"
            placeholder="Search scholars or thesis topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-xs bg-[var(--surface-raised)] border-[var(--border)] focus:border-purple-500"
          />
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-center gap-3 ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
              : "bg-red-500/10 border-red-500/20 text-red-600"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* 2. Students Grid */}
      {filteredStudents.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)]/50 space-y-3">
          <Users className="w-10 h-10 text-[var(--text-secondary)] mx-auto opacity-40" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">No scholars found</p>
          <p className="text-xs text-[var(--text-secondary)]">
            {searchQuery
              ? "No scholar matches your search."
              : "No students have registered under your supervision yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredStudents.map((s) => {
            const isPending = s.status === "PENDING_APPROVAL";
            const isRejected = s.status === "REJECTED";
            const totalHours = s.workLogs.reduce((sum, l) => sum + l.actualHoursUsed, 0);
            const verifiedHours = s.workLogs
              .filter((l) => Boolean(l.verifiedAt))
              .reduce((sum, l) => sum + l.actualHoursUsed, 0);

            return (
              <div
                key={s.id}
                className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-purple-500/30 transition-all space-y-4 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold font-sans text-[var(--text-primary)]">
                        {s.user.name || "Scholar"}
                      </h3>
                      {isPending && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          Pending Approval
                        </span>
                      )}
                      {!isPending && !isRejected && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Active Scholar
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                          Rejected
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-mono text-[var(--text-secondary)] mt-0.5">
                      Student ID: {s.studentId} · {s.program.replace("_", " ")}
                    </div>
                  </div>

                  {isPending && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(s.id)}
                        disabled={processingId === s.id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 h-8 rounded-full"
                      >
                        <UserCheck className="w-3.5 h-3.5 mr-1" />
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
                  )}
                </div>

                {s.thesisTitle && (
                  <div className="p-3 rounded-xl bg-[var(--surface-raised)]/60 border border-[var(--border)] text-xs space-y-0.5">
                    <span className="font-semibold text-[10px] uppercase font-mono text-[var(--text-secondary)]">
                      Thesis / Research Title:
                    </span>
                    <p className="font-medium text-[var(--text-primary)] leading-relaxed">
                      {s.thesisTitle}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-[var(--surface-raised)]/40 border border-[var(--border)]">
                    <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">
                      Session & Batch
                    </div>
                    <div className="font-semibold text-[var(--text-primary)]">
                      {s.sessionYear} {s.batch ? `(${s.batch})` : ""}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[var(--surface-raised)]/40 border border-[var(--border)]">
                    <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">
                      Lab Hours Logged
                    </div>
                    <div className="font-semibold text-[var(--text-primary)]">
                      {Math.round(totalHours * 10) / 10} hrs ({s.workLogs.length} logs)
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[var(--surface-raised)]/40 border border-[var(--border)] col-span-2 sm:col-span-1">
                    <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">
                      Verified Hours
                    </div>
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {Math.round(verifiedHours * 10) / 10} hrs
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[var(--border)] text-[11px] text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{s.user.email}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{s.phone}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
