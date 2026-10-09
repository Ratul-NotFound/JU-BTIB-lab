"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cancelBookingAction } from "@/server/actions/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Clock,
  Radio,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  User,
  Flame,
} from "lucide-react";

interface FloorSession {
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

interface BookingRecord {
  id: string;
  startTime: string | Date;
  endTime: string | Date;
  purpose: string;
  samples: string | null;
  status: string;
  equipment: {
    id: string;
    name: string;
    category: string;
  };
  studentProfile?: {
    studentId: string;
    program: string;
    user: {
      name: string | null;
      email: string;
    };
  } | null;
  facultyProfile?: {
    designation: string;
    user: {
      name: string | null;
      email: string;
    };
  } | null;
}

interface BookingsAdminProps {
  initialFloor: FloorSession[];
  initialBookings: BookingRecord[];
}

export function BookingsAdminClient({ initialFloor, initialBookings }: BookingsAdminProps) {
  const router = useRouter();
  const [floorSessions, setFloorSessions] = React.useState<FloorSession[]>(initialFloor);
  const [bookings, setBookings] = React.useState<BookingRecord[]>(initialBookings);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [cancellingId, setCancellingId] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{ text: string; type: "success" | "error" } | null>(null);

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

  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const equip = b.equipment.name.toLowerCase();
    const reserver = (
      b.studentProfile?.user.name ||
      b.facultyProfile?.user.name ||
      ""
    ).toLowerCase();
    const studentId = (b.studentProfile?.studentId || "").toLowerCase();
    const purpose = b.purpose.toLowerCase();

    return equip.includes(q) || reserver.includes(q) || studentId.includes(q) || purpose.includes(q);
  });

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="specimen-tag text-[10px] py-0 px-2 font-bold uppercase">
              Operational Laboratory Floor
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              {bookings.length} Total Reservations
            </span>
          </div>

          <h1 className="text-2xl font-bold font-sans tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-600" />
            <span>Master Equipment Schedule & Floor Monitor</span>
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-light">
            Live real-time monitoring of currently running lab instruments, scholar sessions, and upcoming equipment bookings.
          </p>
        </div>
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
          <div className="p-8 text-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]/60 space-y-2">
            <Radio className="w-8 h-8 text-[var(--text-secondary)] mx-auto opacity-40" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Lab Floor is Currently Available
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
                className="p-5 rounded-2xl border border-emerald-500/40 bg-[var(--surface)] shadow-md space-y-4 relative overflow-hidden"
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

                  <div className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                    {session.minutesRemaining}m left
                  </div>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-[var(--surface-raised)]/60 border border-[var(--border)] text-xs">
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

      {/* 3. Master Reservations Schedule Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold font-sans text-[var(--text-primary)]">
            Master Timetable & Reservations
          </h2>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <Input
              type="text"
              placeholder="Search instrument, scholar name, or purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-[var(--surface)] border-[var(--border)]"
            />
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-secondary)]">
            No equipment bookings found matching your search.
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]/50 text-[var(--text-secondary)] font-mono uppercase tracking-wider">
                    <th className="p-3.5 pl-5">Instrument</th>
                    <th className="p-3.5">Reserver / Scholar</th>
                    <th className="p-3.5">Scheduled Slot</th>
                    <th className="p-3.5">Purpose & Samples</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 pr-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredBookings.map((b) => {
                    const start = new Date(b.startTime);
                    const end = new Date(b.endTime);
                    const isCancelled = b.status === "CANCELLED";

                    const reserverName =
                      b.studentProfile?.user?.name ||
                      b.facultyProfile?.user?.name ||
                      "Lab Scholar";

                    const reserverSub = b.studentProfile
                      ? `Student ID: ${b.studentProfile.studentId}`
                      : b.facultyProfile
                      ? b.facultyProfile.designation
                      : "";

                    return (
                      <tr key={b.id} className="hover:bg-[var(--surface-raised)]/30 transition-colors">
                        <td className="p-3.5 pl-5">
                          <div className="font-bold text-sm text-[var(--text-primary)]">
                            {b.equipment.name}
                          </div>
                          <div className="text-[11px] font-mono text-[var(--text-secondary)]">
                            {b.equipment.category}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-[var(--text-primary)]">
                            {reserverName}
                          </div>
                          <div className="text-[11px] font-mono text-[var(--text-secondary)]">
                            {reserverSub}
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-[var(--text-secondary)]">
                          <div className="font-semibold text-[var(--text-primary)]">
                            {start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                          <div className="text-[11px]">
                            {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
                            {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </td>
                        <td className="p-3.5 max-w-xs text-[var(--text-secondary)]">
                          <div className="line-clamp-2">{b.purpose}</div>
                          {b.samples && (
                            <div className="text-[11px] font-mono text-[var(--text-muted)] truncate">
                              Samples: {b.samples}
                            </div>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold border ${
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
                        <td className="p-3.5 pr-5">
                          {!isCancelled ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelBooking(b.id)}
                              disabled={cancellingId === b.id}
                              className="text-[11px] h-7 px-2.5 rounded-full text-red-600 border-red-500/20 hover:bg-red-500/10"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" />
                              <span>Cancel</span>
                            </Button>
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
