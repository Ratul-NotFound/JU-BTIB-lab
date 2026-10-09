"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cancelBookingAction } from "@/server/actions/booking";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Clock,
  Radio,
  Search,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  XCircle,
  User,
  Flame,
  FileCheck2,
  Calendar,
  Microscope,
  Eye,
  FileText,
  ShieldCheck,
  Award,
  Sparkles,
} from "lucide-react";

export interface FloorSession {
  id: string;
  equipmentName: string;
  equipmentCategory: string;
  equipmentImageUrl?: string | null;
  scholarName: string;
  scholarEmail: string;
  studentId: string | null;
  program: string | null;
  supervisor: string | null;
  purpose: string;
  samples: string | null;
  startTime: string;
  endTime: string;
  minutesRemaining: number;
}

export interface BookingRecord {
  id: string;
  startTime: string | Date;
  endTime: string | Date;
  purpose: string;
  samples: string | null;
  status: string;
  adminNotes?: string | null;
  createdAt?: string | Date;
  equipment: {
    id: string;
    name: string;
    category: string;
    imageUrl?: string | null;
  };
  studentProfile?: {
    studentId: string;
    program: string;
    thesisTitle?: string | null;
    supervisor?: {
      user: {
        name: string | null;
      };
    } | null;
    user: {
      name: string | null;
      email: string;
    };
  } | null;
  facultyProfile?: {
    designation: string;
    department?: string | null;
    user: {
      name: string | null;
      email: string;
    };
  } | null;
  experimentLog?: {
    id: string;
    title: string;
    actualHoursUsed: number;
    protocolSummary: string;
    observations: string | null;
    dateConducted?: string | Date;
    verifiedBy: string | null;
    verifiedAt: string | Date | null;
    faculty?: {
      user: {
        name: string | null;
      };
    } | null;
  } | null;
}

export interface BookingsAdminProps {
  initialFloor: FloorSession[];
  initialBookings: BookingRecord[];
}

export function BookingsAdminClient({ initialFloor, initialBookings }: BookingsAdminProps) {
  const router = useRouter();
  const [floorSessions, setFloorSessions] = React.useState<FloorSession[]>(initialFloor);
  const [bookings, setBookings] = React.useState<BookingRecord[]>(initialBookings);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<
    "ALL" | "LIVE" | "AWAITING_LOG" | "LOGGED" | "CANCELLED"
  >("ALL");
  const [cancellingId, setCancellingId] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{ text: string; type: "success" | "error" } | null>(null);
  const [selectedDossierBooking, setSelectedDossierBooking] = React.useState<BookingRecord | null>(null);

  const now = React.useMemo(() => new Date(), []);

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this equipment reservation?")) {
      return;
    }

    setCancellingId(id);
    setFeedback(null);
    try {
      const res = await cancelBookingAction(id);
      if (res.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b))
        );
        setFloorSessions((prev) => prev.filter((s) => s.id !== id));
        setFeedback({ text: "Booking has been cancelled.", type: "success" });
        router.refresh();
      } else {
        setFeedback({ text: res.error || "Failed to cancel booking.", type: "error" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error occurred.";
      setFeedback({ text: msg, type: "error" });
    } finally {
      setCancellingId(null);
    }
  };

  // Pre-calculated cohorts
  const awaitingLogBookings = React.useMemo(() => {
    return bookings.filter((b) => {
      const isPastOrComplete = new Date(b.endTime) <= now || b.status === "COMPLETED";
      return isPastOrComplete && !b.experimentLog && b.status !== "CANCELLED";
    });
  }, [bookings, now]);

  const loggedBookings = React.useMemo(() => {
    return bookings.filter((b) => Boolean(b.experimentLog));
  }, [bookings]);

  const liveBookings = React.useMemo(() => {
    return bookings.filter((b) => {
      const start = new Date(b.startTime);
      const end = new Date(b.endTime);
      return start <= now && end >= now && (b.status === "CONFIRMED" || b.status === "IN_PROGRESS");
    });
  }, [bookings, now]);

  const cancelledBookings = React.useMemo(() => {
    return bookings.filter((b) => b.status === "CANCELLED");
  }, [bookings]);

  // Search & Tab filtering
  const filteredBookings = React.useMemo(() => {
    let list = bookings;

    if (activeFilter === "LIVE") {
      list = liveBookings;
    } else if (activeFilter === "AWAITING_LOG") {
      list = awaitingLogBookings;
    } else if (activeFilter === "LOGGED") {
      list = loggedBookings;
    } else if (activeFilter === "CANCELLED") {
      list = cancelledBookings;
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter((b) => {
      const equip = b.equipment.name.toLowerCase();
      const reserver = (
        b.studentProfile?.user.name ||
        b.facultyProfile?.user.name ||
        ""
      ).toLowerCase();
      const studentId = (b.studentProfile?.studentId || "").toLowerCase();
      const purpose = b.purpose.toLowerCase();
      const logTitle = (b.experimentLog?.title || "").toLowerCase();
      const protocol = (b.experimentLog?.protocolSummary || "").toLowerCase();

      return (
        equip.includes(q) ||
        reserver.includes(q) ||
        studentId.includes(q) ||
        purpose.includes(q) ||
        logTitle.includes(q) ||
        protocol.includes(q)
      );
    });
  }, [bookings, activeFilter, liveBookings, awaitingLogBookings, loggedBookings, cancelledBookings, searchQuery]);

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Operational Laboratory Floor
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              {bookings.length} Total Registered Slots
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[var(--text-primary)] flex items-center gap-2.5">
            <Clock className="w-7 h-7 text-emerald-500" />
            <span>Equipment Booking History &amp; Work Log Audit</span>
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
            Audit master equipment reservations, examine what scholars accomplished during each session, verify actual machine runtime, and track supervisor sign-offs.
          </p>
        </div>

        {/* Quick status counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 font-mono text-xs">
          <div className="p-3 rounded-md bg-[var(--surface-raised)] border border-[var(--border)] text-center">
            <span className="block text-[10px] text-[var(--text-muted)] uppercase">Total</span>
            <span className="text-lg font-black text-[var(--text-primary)]">{bookings.length}</span>
          </div>
          <div className="p-3 rounded-md bg-[var(--surface-raised)] border border-[var(--border)] text-center">
            <span className="block text-[10px] text-[var(--text-muted)] uppercase">Live Now</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{floorSessions.length}</span>
          </div>
          <div className="p-3 rounded-md bg-[var(--surface-raised)] border border-[var(--border)] text-center">
            <span className="block text-[10px] text-[var(--text-muted)] uppercase">Awaiting Log</span>
            <span className="text-lg font-black text-amber-500">{awaitingLogBookings.length}</span>
          </div>
          <div className="p-3 rounded-md bg-[var(--surface-raised)] border border-[var(--border)] text-center">
            <span className="block text-[10px] text-[var(--text-muted)] uppercase">Work Logged</span>
            <span className="text-lg font-black text-purple-500">{loggedBookings.length}</span>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-md border text-sm flex items-center gap-3 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
              : "bg-red-500/10 border-red-500/20 text-red-600"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* 2. Live Floor Monitor: "Who is in the Lab Right Now" */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </div>
            <h2 className="text-base font-bold font-sans text-[var(--text-primary)]">
              Live Floor Monitor — Active Laboratory Sessions Right Now ({floorSessions.length})
            </h2>
          </div>
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            Auto-synchronized with lab clock
          </span>
        </div>

        {floorSessions.length === 0 ? (
          <div className="p-8 text-center rounded-md border border-dashed border-[var(--border)] bg-[var(--surface)]/60 space-y-2">
            <Radio className="w-8 h-8 text-[var(--text-secondary)] mx-auto opacity-40" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Lab Floor is Currently Clear
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              No instruments are actively running at this exact moment. All slots are clear.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {floorSessions.map((session) => (
              <div
                key={session.id}
                className="p-5 rounded-md border border-emerald-500/40 bg-[var(--surface)] shadow-md space-y-4 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>IN PROGRESS NOW</span>
                    </span>
                    <h3 className="font-bold text-base text-[var(--text-primary)]">
                      {session.equipmentName}
                    </h3>
                    <div className="text-xs text-[var(--text-secondary)]">
                      {session.equipmentCategory}
                    </div>
                  </div>

                  <div className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                    {session.minutesRemaining}m left
                  </div>
                </div>

                <div className="space-y-1.5 p-3 rounded bg-[var(--surface-raised)]/60 border border-[var(--border)] text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
                    <User className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{session.scholarName}</span>
                    {session.studentId && (
                      <span className="text-[11px] font-mono text-[var(--text-secondary)] font-normal">
                        ({session.studentId})
                      </span>
                    )}
                  </div>
                  <p className="text-[var(--text-secondary)] line-clamp-2 italic">
                    &quot;{session.purpose}&quot;
                  </p>
                  {session.supervisor && (
                    <div className="text-[11px] text-[var(--text-secondary)] font-mono">
                      Supervisor: {session.supervisor}
                    </div>
                  )}
                </div>

                <div className="text-[11px] font-mono text-[var(--text-secondary)] flex items-center justify-between pt-1">
                  <span>
                    {new Date(session.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                    {new Date(session.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="text-emerald-600 font-semibold">Active Run</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Master Reservations Schedule Table with Work Log Columns */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black font-sans text-[var(--text-primary)]">
              Equipment Booking &amp; Research History Table
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Showing slot timetable, research objective, what the booker performed during the slot, and verification status.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-md bg-[var(--surface-raised)] border border-[var(--border)] text-[11px] overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveFilter("ALL")}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  activeFilter === "ALL"
                    ? "bg-[var(--brand-primary)] text-white shadow-2xs font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                All ({bookings.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("LIVE")}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  activeFilter === "LIVE"
                    ? "bg-emerald-600 text-white shadow-2xs font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Live ({liveBookings.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("AWAITING_LOG")}
                className={`px-2.5 py-1 rounded font-medium transition-all flex items-center gap-1 ${
                  activeFilter === "AWAITING_LOG"
                    ? "bg-amber-600 text-white shadow-2xs font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <span>Awaiting Log</span>
                {awaitingLogBookings.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-bold">
                    {awaitingLogBookings.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("LOGGED")}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  activeFilter === "LOGGED"
                    ? "bg-purple-600 text-white shadow-2xs font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Logged ({loggedBookings.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("CANCELLED")}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  activeFilter === "CANCELLED"
                    ? "bg-red-600 text-white shadow-2xs font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Cancelled ({cancelledBookings.length})
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <Input
                type="text"
                placeholder="Search instrument, scholar, protocol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-[var(--surface)] border-[var(--border)] rounded-md"
              />
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center rounded-md border border-dashed border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-secondary)] space-y-2">
            <Calendar className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
            <p className="font-semibold text-[var(--text-primary)]">No equipment bookings found</p>
            <p>Try switching filter tabs or clearing your search query.</p>
          </div>
        ) : (
          <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]/60 text-[var(--text-secondary)] font-mono uppercase tracking-wider text-[11px]">
                    <th className="p-3.5 pl-5">Instrument</th>
                    <th className="p-3.5">Reserver / Scholar</th>
                    <th className="p-3.5">Scheduled Slot &amp; Period</th>
                    <th className="p-3.5">Initial Purpose &amp; Samples</th>
                    <th className="p-3.5 min-w-[240px]">What Booker Did (Work Log)</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 pr-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredBookings.map((b) => {
                    const start = new Date(b.startTime);
                    const end = new Date(b.endTime);
                    const isCancelled = b.status === "CANCELLED";
                    const isPast = end <= now;
                    const log = b.experimentLog;

                    const reserverName =
                      b.studentProfile?.user?.name ||
                      b.facultyProfile?.user?.name ||
                      "Lab Scholar";

                    const reserverSub = b.studentProfile
                      ? `ID: ${b.studentProfile.studentId} · ${b.studentProfile.program.replace("_", " ")}`
                      : b.facultyProfile
                      ? b.facultyProfile.designation
                      : "";

                    const supervisorName =
                      b.studentProfile?.supervisor?.user?.name ||
                      (b.studentProfile ? "Assigned Faculty" : null);

                    // Duration in hours
                    const plannedDurationHours = Math.round(((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 10) / 10;

                    return (
                      <tr key={b.id} className="hover:bg-[var(--surface-raised)]/40 transition-colors">
                        {/* Instrument */}
                        <td className="p-3.5 pl-5">
                          <div className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                            <Microscope className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{b.equipment.name}</span>
                          </div>
                          <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-0.5">
                            {b.equipment.category}
                          </div>
                        </td>

                        {/* Reserver */}
                        <td className="p-3.5">
                          <div className="font-semibold text-[var(--text-primary)]">
                            {reserverName}
                          </div>
                          <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-0.5">
                            {reserverSub}
                          </div>
                          {supervisorName && (
                            <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                              Supervisor: {supervisorName}
                            </div>
                          )}
                        </td>

                        {/* Slot & Time Period */}
                        <td className="p-3.5 font-mono text-[var(--text-secondary)]">
                          <div className="font-semibold text-[var(--text-primary)]">
                            {start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                          <div className="text-[11px] mt-0.5">
                            {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
                            {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                            ({plannedDurationHours} hrs scheduled)
                          </div>
                        </td>

                        {/* Purpose & Samples */}
                        <td className="p-3.5 max-w-xs text-[var(--text-secondary)]">
                          <div className="line-clamp-2 leading-relaxed" title={b.purpose}>
                            {b.purpose}
                          </div>
                          {b.samples && (
                            <div className="text-[11px] font-mono text-[var(--text-muted)] truncate mt-1">
                              Samples: {b.samples}
                            </div>
                          )}
                        </td>

                        {/* What the Booker Done / Experiment Log */}
                        <td className="p-3.5">
                          {log ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
                                <FileCheck2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span className="truncate max-w-[200px]" title={log.title}>
                                  {log.title}
                                </span>
                              </div>
                              <div className="text-[11px] text-[var(--text-secondary)] line-clamp-2 italic leading-relaxed" title={log.protocolSummary}>
                                &quot;{log.protocolSummary}&quot;
                              </div>
                              <div className="flex flex-wrap items-center gap-2 pt-0.5 font-mono text-[10px]">
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                                  {log.actualHoursUsed} hrs run
                                </span>
                                {log.verifiedBy ? (
                                  <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>Verified</span>
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                    Pending Sign-off
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : isCancelled ? (
                            <span className="text-[11px] font-mono text-[var(--text-muted)] italic">
                              Session cancelled
                            </span>
                          ) : isPast || b.status === "COMPLETED" ? (
                            <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] space-y-0.5">
                              <span className="font-bold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-500" />
                                <span>Awaiting Post-Run Log</span>
                              </span>
                              <span className="text-[10px] block opacity-80">
                                Slot concluded; scholar hasn&apos;t filed protocol report yet.
                              </span>
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[11px] font-mono text-[var(--text-muted)] bg-[var(--surface-raised)] border border-[var(--border)]">
                              Upcoming / Slot Active
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                              b.status === "CONFIRMED"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : b.status === "IN_PROGRESS"
                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                                : b.status === "COMPLETED"
                                ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                                : "bg-red-500/10 text-red-600 border-red-500/20"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 pr-5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedDossierBooking(b)}
                              className="text-[11px] h-7 px-2.5 rounded-md text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1 text-sky-500" />
                              <span>Dossier</span>
                            </Button>

                            {!isCancelled && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelBooking(b.id)}
                                disabled={cancellingId === b.id}
                                className="text-[11px] h-7 px-2 rounded-md text-red-600 border-red-500/20 hover:bg-red-500/10"
                                title="Cancel booking"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
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

      {/* 4. Complete Reservation & Work Log Dossier Modal */}
      {selectedDossierBooking && (
        <Dialog
          open={Boolean(selectedDossierBooking)}
          onOpenChange={(open) => {
            if (!open) setSelectedDossierBooking(null);
          }}
          title="Equipment Reservation & Run Dossier"
          description={`Comprehensive audit record for ${selectedDossierBooking.equipment.name} (Ref: ${selectedDossierBooking.id.slice(-8)})`}
          size="2xl"
        >
          <div className="space-y-6 text-xs text-[var(--text-primary)]">
            {/* Header Instrument & Status */}
            <div className="p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  Instrument &amp; Category
                </span>
                <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Microscope className="w-4 h-4 text-emerald-500" />
                  <span>{selectedDossierBooking.equipment.name}</span>
                </h3>
                <span className="text-xs text-[var(--text-secondary)] font-mono">
                  {selectedDossierBooking.equipment.category}
                </span>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-1.5 shrink-0">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Status</span>
                <span
                  className={`px-3 py-1 rounded text-xs font-mono font-bold border ${
                    selectedDossierBooking.status === "CONFIRMED"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : selectedDossierBooking.status === "COMPLETED"
                      ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                      : "bg-red-500/10 text-red-600 border-red-500/20"
                  }`}
                >
                  {selectedDossierBooking.status}
                </span>
              </div>
            </div>

            {/* Grid: Reserver Dossier & Slot Timetable */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Scholar / Booker Details */}
              <div className="p-4 rounded-md border border-[var(--border)] bg-[var(--surface)] space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  <User className="w-3.5 h-3.5 text-sky-500" />
                  <span>Booker Information</span>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-sm block">
                    {selectedDossierBooking.studentProfile?.user.name ||
                      selectedDossierBooking.facultyProfile?.user.name ||
                      "Lab Scholar"}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-secondary)] block">
                    {selectedDossierBooking.studentProfile?.user.email ||
                      selectedDossierBooking.facultyProfile?.user.email}
                  </span>
                </div>

                <div className="pt-2 border-t border-[var(--border)] space-y-1 font-mono text-[11px]">
                  {selectedDossierBooking.studentProfile && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Student ID:</span>
                        <span className="font-semibold">{selectedDossierBooking.studentProfile.studentId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Program:</span>
                        <span>{selectedDossierBooking.studentProfile.program.replace("_", " ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Supervisor:</span>
                        <span className="text-[var(--brand-primary)]">
                          {selectedDossierBooking.studentProfile.supervisor?.user.name || "Assigned Faculty"}
                        </span>
                      </div>
                    </>
                  )}
                  {selectedDossierBooking.facultyProfile && (
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Designation:</span>
                      <span className="font-semibold">{selectedDossierBooking.facultyProfile.designation}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Slot Schedule & Time Period */}
              <div className="p-4 rounded-md border border-[var(--border)] bg-[var(--surface)] space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Time Period &amp; Duration</span>
                </div>

                <div className="space-y-1 font-mono">
                  <div className="text-sm font-bold">
                    {new Date(selectedDossierBooking.startTime).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    ⏰ {new Date(selectedDossierBooking.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
                    {new Date(selectedDossierBooking.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border)] space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Planned Duration:</span>
                    <span className="font-semibold">
                      {Math.round(
                        ((new Date(selectedDossierBooking.endTime).getTime() -
                          new Date(selectedDossierBooking.startTime).getTime()) /
                          (1000 * 60 * 60)) *
                          10
                      ) / 10}{" "}
                      hours
                    </span>
                  </div>
                  {selectedDossierBooking.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Booked On:</span>
                      <span>{new Date(selectedDossierBooking.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section: Initial Declared Plan */}
            <div className="p-4 rounded-md border border-[var(--border)] bg-[var(--surface)] space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>Declared Purpose &amp; Samples (Before Session)</span>
              </span>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Declared Purpose:</span>
                <p className="text-xs text-[var(--text-primary)] leading-relaxed bg-[var(--surface-raised)]/50 p-2.5 rounded border border-[var(--border)]">
                  {selectedDossierBooking.purpose}
                </p>
              </div>

              {selectedDossierBooking.samples && (
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Samples &amp; Reagents:</span>
                  <p className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--surface-raised)]/50 p-2.5 rounded border border-[var(--border)]">
                    {selectedDossierBooking.samples}
                  </p>
                </div>
              )}
            </div>

            {/* Section: WHAT THE BOOKER DID (Post-Run Experiment Log) */}
            <div className="p-5 rounded-md border border-[var(--border)] bg-[var(--surface)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>What Booker Accomplished During Session (Post-Run Log)</span>
                </span>

                {selectedDossierBooking.experimentLog && (
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {selectedDossierBooking.experimentLog.actualHoursUsed} hrs actual runtime
                  </span>
                )}
              </div>

              {selectedDossierBooking.experimentLog ? (
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Experiment Title:</span>
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">
                      {selectedDossierBooking.experimentLog.title}
                    </h4>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase">
                      Protocol Performed &amp; Operational Steps:
                    </span>
                    <p className="text-xs text-[var(--text-primary)] leading-relaxed bg-[var(--surface-raised)]/60 p-3 rounded-md border border-[var(--border)] whitespace-pre-wrap">
                      {selectedDossierBooking.experimentLog.protocolSummary}
                    </p>
                  </div>

                  {selectedDossierBooking.experimentLog.observations && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase">
                        Findings, Observations &amp; Equipment Cleanup State:
                      </span>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--surface-raised)]/60 p-3 rounded-md border border-[var(--border)] whitespace-pre-wrap">
                        {selectedDossierBooking.experimentLog.observations}
                      </p>
                    </div>
                  )}

                  <div className="p-3 rounded-md bg-[var(--surface-raised)]/80 border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-500" />
                      <span>
                        Supervisor Verification:{" "}
                        {selectedDossierBooking.experimentLog.verifiedBy ? (
                          <strong className="text-emerald-600 dark:text-emerald-400">
                            Approved by {selectedDossierBooking.experimentLog.faculty?.user?.name || selectedDossierBooking.experimentLog.verifiedBy}
                          </strong>
                        ) : (
                          <strong className="text-amber-500">Pending Faculty Sign-off</strong>
                        )}
                      </span>
                    </div>

                    {selectedDossierBooking.experimentLog.verifiedAt && (
                      <span className="text-[var(--text-muted)]">
                        Signed: {new Date(selectedDossierBooking.experimentLog.verifiedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-md border border-dashed border-[var(--border)] bg-[var(--surface-raised)]/30 text-center space-y-1.5 text-xs text-[var(--text-muted)]">
                  <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto opacity-70" />
                  <p className="font-semibold text-[var(--text-primary)]">
                    No Post-Run Work Log Submitted Yet
                  </p>
                  <p className="text-[11px]">
                    {new Date(selectedDossierBooking.endTime) <= now
                      ? "The reserved machine time has ended. The scholar can submit their work log from their student portal."
                      : "The slot has not yet concluded. Booker will document accomplishments after completing their run."}
                  </p>
                </div>
              )}
            </div>

            {/* Admin Notes if present */}
            {selectedDossierBooking.adminNotes && (
              <div className="p-3.5 rounded-md border border-sky-500/20 bg-sky-500/5 text-xs space-y-1">
                <span className="font-bold text-sky-600 dark:text-sky-400 block font-mono text-[11px]">
                  Administrative Notes:
                </span>
                <p className="text-[var(--text-secondary)]">{selectedDossierBooking.adminNotes}</p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDossierBooking(null)}
                className="rounded-md text-xs font-semibold"
              >
                Close Dossier
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
