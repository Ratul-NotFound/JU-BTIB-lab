"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { verifyExperimentLogAction } from "@/server/actions/experiment-log";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileCheck2,
  Clock,
  Calendar,
  Microscope,
  Search,
  CheckCircle2,
  AlertCircle,
  Filter,
  Check,
  GraduationCap,
} from "lucide-react";

interface LogTraceItem {
  id: string;
  title: string;
  protocolSummary: string;
  observations: string | null;
  actualHoursUsed: number;
  dateConducted: string | Date;
  verifiedBy: string | null;
  verifiedAt: string | Date | null;
  equipment: {
    name: string;
    category: string;
  };
  studentProfile: {
    studentId: string;
    program: string;
    user: {
      name: string | null;
      email: string;
    };
    supervisor?: {
      user: {
        name: string | null;
      };
    } | null;
  };
}

interface ActivityTracerProps {
  logs: LogTraceItem[];
  facultyName: string;
}

export function ActivityTracerClient({ logs: initialLogs, facultyName }: ActivityTracerProps) {
  const router = useRouter();
  const [logs, setLogs] = React.useState<LogTraceItem[]>(initialLogs);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | "PENDING" | "VERIFIED">("ALL");
  const [signingId, setSigningId] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<{ text: string; type: "success" | "error" } | null>(
    null
  );

  const handleSignOff = async (logId: string) => {
    setSigningId(logId);
    setMessage(null);
    try {
      const res = await verifyExperimentLogAction(logId);
      if (res.success) {
        setLogs((prev) =>
          prev.map((l) =>
            l.id === logId
              ? {
                  ...l,
                  verifiedAt: new Date(),
                  verifiedBy: facultyName,
                }
              : l
          )
        );
        setMessage({ text: "Experiment log certified successfully.", type: "success" });
        router.refresh();
      } else {
        setMessage({ text: res.error || "Failed to certify log.", type: "error" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred.";
      setMessage({ text: msg, type: "error" });
    } finally {
      setSigningId(null);
    }
  };

  const filteredLogs = logs.filter((log) => {
    // 1. Status Filter
    if (statusFilter === "PENDING" && log.verifiedAt) return false;
    if (statusFilter === "VERIFIED" && !log.verifiedAt) return false;

    // 2. Search Filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const studentName = log.studentProfile.user.name?.toLowerCase() || "";
    const studentId = log.studentProfile.studentId.toLowerCase();
    const title = log.title.toLowerCase();
    const equipment = log.equipment.name.toLowerCase();
    const protocol = log.protocolSummary.toLowerCase();

    return (
      studentName.includes(q) ||
      studentId.includes(q) ||
      title.includes(q) ||
      equipment.includes(q) ||
      protocol.includes(q)
    );
  });

  const totalHours = logs.reduce((sum, l) => sum + l.actualHoursUsed, 0);
  const pendingCount = logs.filter((l) => !l.verifiedAt).length;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Departmental Activity Tracer</span>
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              {logs.length} Total Logs · {Math.round(totalHours * 10) / 10} Total Hours
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[var(--text-primary)]">
            Student Research Activity Tracer
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-light">
            Real-time trace of lab experiments performed by scholars. Review protocol methodology,
            machine runtimes, and issue digital academic verifications.
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center gap-3 shrink-0">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="text-xs">
              <span className="font-bold">{pendingCount} log(s)</span> await your supervisor signature.
            </div>
          </div>
        )}
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-center gap-3 ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
              : "bg-red-500/10 border-red-500/20 text-red-600"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* 2. Search & Filter Bar */}
      <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <Input
            type="text"
            placeholder="Search scholar name, roll, instrument, or protocol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-xs bg-[var(--surface-raised)] border-[var(--border)] focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[var(--text-secondary)] font-mono flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          <div className="flex items-center gap-1">
            {(["ALL", "PENDING", "VERIFIED"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                  statusFilter === filter
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]"
                }`}
              >
                {filter === "ALL" ? "All Logs" : filter === "PENDING" ? "Pending Sign-off" : "Verified"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Log Records Stream */}
      {filteredLogs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)]/50 space-y-3">
          <FileCheck2 className="w-10 h-10 text-[var(--text-secondary)] mx-auto opacity-40" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">No matching research logs</p>
          <p className="text-xs text-[var(--text-secondary)]">
            Adjust your search query or status filter to see experiment logs.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => {
            const isVerified = Boolean(log.verifiedAt);
            const conductedDate = new Date(log.dateConducted).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={log.id}
                className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-purple-500/30 transition-all space-y-4 shadow-2xs"
              >
                {/* Scholar & Meta Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-sm shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[var(--text-primary)]">
                          {log.studentProfile.user.name || "Scholar"}
                        </span>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-secondary)]">
                          {log.studentProfile.studentId}
                        </span>
                        <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                          {log.studentProfile.program.replace("_", " ")}
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)]">
                        {log.studentProfile.user.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs font-mono text-[var(--text-secondary)]">
                      <div className="flex items-center gap-1.5 justify-end">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{conductedDate}</span>
                      </div>
                      <div className="flex items-center gap-1 justify-end font-semibold text-[var(--text-primary)]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{log.actualHoursUsed} hrs runtime</span>
                      </div>
                    </div>

                    {isVerified ? (
                      <div className="px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Signed by {log.verifiedBy || "Supervisor"}</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleSignOff(log.id)}
                        disabled={signingId === log.id}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 py-2 rounded-full font-medium flex items-center gap-1.5 shadow-xs shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{signingId === log.id ? "Signing..." : "Verify & Sign Off"}</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Experiment Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <Microscope className="w-3.5 h-3.5" />
                      <span>{log.equipment.name}</span>
                    </span>
                    <h3 className="font-bold text-base text-[var(--text-primary)]">
                      {log.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-[var(--surface-raised)]/60 border border-[var(--border)] space-y-1">
                      <span className="font-semibold uppercase tracking-wider text-[10px] text-[var(--text-secondary)]">
                        Protocol & Methodology:
                      </span>
                      <p className="text-[var(--text-primary)] leading-relaxed font-sans whitespace-pre-wrap">
                        {log.protocolSummary}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--surface-raised)]/60 border border-[var(--border)] space-y-1">
                      <span className="font-semibold uppercase tracking-wider text-[10px] text-[var(--text-secondary)]">
                        Key Observations & Findings:
                      </span>
                      <p className="text-[var(--text-primary)] leading-relaxed font-sans whitespace-pre-wrap">
                        {log.observations || "No specific observations annotated."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
