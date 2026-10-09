"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createExperimentLogAction } from "@/server/actions/experiment-log";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Microscope,
  Calendar,
  Sparkles,
  Award,
  Printer,
  Search,
} from "lucide-react";

interface EquipmentOption {
  id: string;
  name: string;
  category: string;
}

interface LogEntry {
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
  faculty?: {
    user: {
      name: string | null;
    };
  } | null;
}

interface StudentHistoryProps {
  initialLogs: LogEntry[];
  totalHours: number;
  equipmentList: EquipmentOption[];
  studentName: string;
  studentId: string;
  program: string;
  supervisorName: string;
}

export function StudentHistoryClient({
  initialLogs,
  totalHours,
  equipmentList,
  studentName,
  studentId,
  program,
  supervisorName,
}: StudentHistoryProps) {
  const router = useRouter();
  const [logs, setLogs] = React.useState<LogEntry[]>(initialLogs);
  const [showForm, setShowForm] = React.useState(false);

  // Form State
  const [title, setTitle] = React.useState("");
  const [equipmentId, setEquipmentId] = React.useState(equipmentList[0]?.id || "");
  const [actualHoursUsed, setActualHoursUsed] = React.useState("2.0");
  const [dateConducted, setDateConducted] = React.useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [protocolSummary, setProtocolSummary] = React.useState("");
  const [observations, setObservations] = React.useState("");

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filtered logs
  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    return (
      log.title.toLowerCase().includes(q) ||
      log.equipment.name.toLowerCase().includes(q) ||
      (log.protocolSummary && log.protocolSummary.toLowerCase().includes(q))
    );
  });

  const verifiedCount = logs.filter((l) => Boolean(l.verifiedAt)).length;
  const verifiedHours = logs
    .filter((l) => Boolean(l.verifiedAt))
    .reduce((sum, l) => sum + l.actualHoursUsed, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      const hoursNum = parseFloat(actualHoursUsed);
      if (isNaN(hoursNum) || hoursNum <= 0) {
        throw new Error("Please enter a valid number of hours.");
      }

      const res = await createExperimentLogAction({
        equipmentId,
        title,
        protocolSummary,
        observations: observations ? observations : undefined,
        actualHoursUsed: hoursNum,
        dateConducted,
      });

      if (!res.success) {
        setError(res.error || "Failed to submit log.");
      } else {
        setSuccessMsg(res.message || "Experiment log saved successfully!");
        if (res.log) {
          setLogs((prev) => [res.log as unknown as LogEntry, ...prev]);
        }
        setTitle("");
        setProtocolSummary("");
        setObservations("");
        setActualHoursUsed("2.0");
        setShowForm(false);
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header & Quick Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Research Logbook & Activity</span>
            </span>
            <span className="px-3 py-1 rounded text-xs font-mono font-semibold bg-[var(--surface-raised)] text-[var(--text-secondary)] border border-[var(--border)]">
              {logs.length} Entries Logged
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[var(--text-primary)]">
            Experimental Work Logbook
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light max-w-2xl">
            Official laboratory logbook documenting instrument operating hours, experimental procedures,
            and supervisor verifications for {studentName} ({studentId || "Scholar"}) · {program ? program.replace("_", " ") : "Research Scholar"}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={() => window.print()}
            variant="outline"
            className="text-xs font-medium border-[var(--border)] hover:bg-[var(--surface-raised)] flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Dossier</span>
          </Button>

          <Button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2.5 rounded-md flex items-center gap-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showForm ? "Close Form" : "Log New Experiment"}</span>
          </Button>
        </div>
      </div>

      {/* 2. Analytical Statistics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-md border border-[var(--border)] bg-[var(--surface)] flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">
              Total Lab Runtime
            </div>
            <div className="text-2xl font-black font-sans text-[var(--text-primary)]">
              {totalHours} <span className="text-sm font-normal text-[var(--text-secondary)]">hrs</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-md border border-[var(--border)] bg-[var(--surface)] flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">
              Verified Runtime
            </div>
            <div className="text-2xl font-black font-sans text-[var(--text-primary)]">
              {verifiedHours}{" "}
              <span className="text-sm font-normal text-[var(--text-secondary)]">
                hrs ({verifiedCount} logs)
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-md border border-[var(--border)] bg-[var(--surface)] flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Microscope className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">
              Thesis Supervisor
            </div>
            <div className="text-sm font-bold font-sans text-[var(--text-primary)] truncate">
              {supervisorName || "Assigned Faculty"}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Success Message Alert */}
      {successMsg && (
        <div className="p-4 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm">{successMsg}</p>
        </div>
      )}

      {/* 4. Log Experiment Form (Expandable) */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 rounded-md border border-emerald-500/30 bg-[var(--surface)] shadow-lg space-y-6 relative overflow-hidden"
        >
          <div className="space-y-1">
            <h2 className="text-lg font-bold font-sans text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <span>Record Experimental Protocol & Observations</span>
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Document your lab session for formal supervisor review and thesis accreditation.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Experiment / Activity Title *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. PCR amplification of 16S rRNA gene from environmental samples"
                required
                className="bg-[var(--surface-raised)] border-[var(--border)] focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Instrument Used *
              </label>
              <select
                value={equipmentId}
                onChange={(e) => setEquipmentId(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                required
              >
                {equipmentList.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.name} ({eq.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Date Conducted *
                </label>
                <Input
                  type="date"
                  value={dateConducted}
                  onChange={(e) => setDateConducted(e.target.value)}
                  required
                  className="bg-[var(--surface-raised)] border-[var(--border)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Runtime (Hours) *
                </label>
                <Input
                  type="number"
                  step="0.5"
                  min="0.1"
                  max="24"
                  value={actualHoursUsed}
                  onChange={(e) => setActualHoursUsed(e.target.value)}
                  required
                  className="bg-[var(--surface-raised)] border-[var(--border)]"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Protocol & Methodology Summary *
              </label>
              <Textarea
                value={protocolSummary}
                onChange={(e) => setProtocolSummary(e.target.value)}
                placeholder="Detail sample preparation, master mix composition, thermal cycling conditions, or standard operating steps..."
                rows={3}
                required
                className="bg-[var(--surface-raised)] border-[var(--border)] focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Key Observations & Experimental Outcomes (Optional)
              </label>
              <Textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Band clarity on gel electrophoresis, peak absorbance at 260/280 nm, unexpected sample precipitants..."
                rows={2}
                className="bg-[var(--surface-raised)] border-[var(--border)] focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
              className="text-xs border-[var(--border)]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-6 py-2.5 rounded-md font-medium"
            >
              {submitting ? "Saving to Logbook..." : "Save Log Entry"}
            </Button>
          </div>
        </form>
      )}

      {/* 5. Search Bar & Log Entries List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold font-sans text-[var(--text-primary)]">
            Chronological Research Records
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <Input
              type="text"
              placeholder="Search experiments or instruments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-[var(--surface)] border-[var(--border)]"
            />
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center rounded-md border border-dashed border-[var(--border)] bg-[var(--surface)]/50 space-y-4">
            <div className="w-12 h-12 rounded-md bg-[var(--surface-raised)] text-[var(--text-secondary)] flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[var(--text-primary)]">No experiment logs found</p>
              <p className="text-xs text-[var(--text-secondary)]">
                {searchQuery
                  ? "Try searching with a different term."
                  : "Click 'Log New Experiment' above to record your first laboratory session."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => {
              const isVerified = Boolean(log.verifiedAt);
              const formattedDate = new Date(log.dateConducted).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={log.id}
                  className="p-5 sm:p-6 rounded-md border border-[var(--border)] bg-[var(--surface)] hover:border-emerald-500/30 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <Microscope className="w-3 h-3" />
                          <span>{log.equipment.name}</span>
                        </span>
                        <span className="text-xs font-mono text-[var(--text-secondary)] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formattedDate}</span>
                        </span>
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-primary)] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{log.actualHoursUsed} hrs</span>
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold font-sans text-[var(--text-primary)]">
                        {log.title}
                      </h3>
                    </div>

                    <div>
                      {isVerified ? (
                        <div className="px-3 py-1.5 rounded text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            Verified by {log.faculty?.user?.name || log.verifiedBy || "Supervisor"}
                          </span>
                        </div>
                      ) : (
                        <div className="px-3 py-1.5 rounded text-xs font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5 shrink-0">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Pending Supervisor Verification</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-[var(--border)] text-xs sm:text-sm text-[var(--text-secondary)]">
                    <div>
                      <span className="font-semibold text-[var(--text-primary)] block text-xs uppercase tracking-wider mb-1">
                        Protocol & Methodology:
                      </span>
                      <p className="leading-relaxed bg-[var(--surface-raised)]/50 p-3 rounded-md border border-[var(--border)] font-sans">
                        {log.protocolSummary}
                      </p>
                    </div>

                    {log.observations && (
                      <div>
                        <span className="font-semibold text-[var(--text-primary)] block text-xs uppercase tracking-wider mb-1">
                          Observations / Findings:
                        </span>
                        <p className="leading-relaxed bg-[var(--surface-raised)]/50 p-3 rounded-md border border-[var(--border)] font-sans">
                          {log.observations}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
