"use client";

import * as React from "react";
import Link from "next/link";
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
  FileCheck2,
  Edit3,
  Bell,
  Pin,
} from "lucide-react";
import { NoticeCategory, NoticePriority, NoticeAudience } from "@prisma/client";
import { PostRunLogModal, BookingToLog } from "@/components/portal/post-run-log-modal";

export interface DashboardNoticeItem {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  priority: NoticePriority;
  targetAudience: NoticeAudience;
  pinned: boolean;
  published: boolean;
  expiresAt: Date | string | null;
  authorName: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface BookingItem {
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
    imageUrl?: string | null;
  };
  experimentLog?: {
    id: string;
    title: string;
    actualHoursUsed: number;
    protocolSummary: string;
    observations: string | null;
    verifiedBy: string | null;
    verifiedAt: string | Date | null;
  } | null;
}

interface ScholarDashboardClientProps {
  userName: string;
  userEmail: string;
  profile: {
    id: string;
    studentId: string;
    program: string;
    sessionYear: string;
    batch?: string | null;
    phone: string;
    thesisTitle?: string | null;
    supervisorName?: string | null;
    supervisor?: {
      user: {
        name: string;
        email: string;
      };
    } | null;
  } | null;
  isPending: boolean;
  isRejected: boolean;
  totalHours: number;
  bookings: BookingItem[];
  notices?: DashboardNoticeItem[];
}

export function ScholarDashboardClient({
  userName,
  userEmail,
  profile,
  isPending,
  isRejected,
  totalHours,
  bookings,
  notices = [],
}: ScholarDashboardClientProps) {
  const [selectedBookingForLog, setSelectedBookingForLog] = React.useState<BookingToLog | null>(null);
  const [logModalOpen, setLogModalOpen] = React.useState(false);
  const [activeFilter, setActiveFilter] = React.useState<"ALL" | "UPCOMING" | "AWAITING_LOG" | "COMPLETED">("ALL");

  const now = React.useMemo(() => new Date(), []);

  // Filter urgent or pinned notices for the prominent alert bar
  const urgentOrPinnedNotices = React.useMemo(() => {
    return notices.filter((n) => n.pinned || n.priority === "URGENT" || n.priority === "HIGH");
  }, [notices]);

  // Bookings that need post-run logging (slot ended or completed, but no log yet)
  const awaitingLogBookings = bookings.filter((b) => {
    const isPastOrComplete = new Date(b.endTime) <= now || b.status === "COMPLETED";
    return isPastOrComplete && !b.experimentLog && b.status !== "CANCELLED";
  });

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.endTime) > now && b.status === "CONFIRMED"
  );

  const completedBookings = bookings.filter(
    (b) => Boolean(b.experimentLog) || b.status === "COMPLETED"
  );

  const displayedBookings = React.useMemo(() => {
    if (activeFilter === "UPCOMING") return upcomingBookings;
    if (activeFilter === "AWAITING_LOG") return awaitingLogBookings;
    if (activeFilter === "COMPLETED") return completedBookings;
    return bookings;
  }, [activeFilter, bookings, upcomingBookings, awaitingLogBookings, completedBookings]);

  const handleOpenLogModal = (b: BookingItem) => {
    setSelectedBookingForLog({
      id: b.id,
      equipmentName: b.equipment.name,
      equipmentCategory: b.equipment.category,
      startTime: b.startTime,
      endTime: b.endTime,
      purpose: b.purpose,
      samples: b.samples,
      existingLog: b.experimentLog || null,
    });
    setLogModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* 1. Header Banner & Welcome */}
      <div className="p-6 sm:p-8 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>BTIB Scholar Portal</span>
            </span>
            {isPending && (
              <span className="px-3 py-1 rounded-md text-xs font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Verification Pending</span>
              </span>
            )}
            {!isPending && !isRejected && (
              <span className="px-3 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Scholar Clearance</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[var(--text-primary)]">
            Welcome back, {userName}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
            {profile?.program?.replace("_", " ")} · Student ID: {profile?.studentId || "N/A"} · Supervisor:{" "}
            <span className="font-medium text-[var(--text-primary)]">
              {profile?.supervisor ? profile.supervisor.user.name : profile?.supervisorName || "Assigned Faculty Member"}
            </span>
          </p>
        </div>

        {/* Top Action Controls */}
        <div className="flex items-center gap-3 shrink-0 relative z-10">
          {!isPending && (
            <Link
              href="/portal/book"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-xs font-bold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book Instrument</span>
            </Link>
          )}
          <Link
            href="/portal/history"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-md text-xs font-semibold bg-[var(--surface-raised)] hover:bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] transition-all shadow-xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>Full Thesis Logbook</span>
          </Link>
        </div>
      </div>

      {/* Notice Alert Banner: Pinned or Urgent Notices */}
      {urgentOrPinnedNotices.length > 0 && (
        <div className="p-4 sm:p-5 rounded-md border border-[var(--brand-primary)]/30 bg-[var(--surface-raised)]/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center shrink-0 mt-0.5">
              <Bell className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)]">
                  {urgentOrPinnedNotices[0].title}
                </span>
                {urgentOrPinnedNotices[0].priority === "URGENT" && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-rose-500 text-white animate-pulse">
                    URGENT
                  </span>
                )}
                {urgentOrPinnedNotices[0].pinned && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 flex items-center gap-1">
                    <Pin className="w-2.5 h-2.5 fill-current rotate-45" />
                    <span>PINNED</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-2 font-light">
                {urgentOrPinnedNotices[0].content}
              </p>
            </div>
          </div>
          <Link
            href="/portal/notices"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--surface)] hover:bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-primary)] transition-all shrink-0 self-start sm:self-center shadow-2xs"
          >
            <span>View All Notices ({notices.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 2. Urgent Callout: Sessions Awaiting Post-Run Work Log */}
      {awaitingLogBookings.length > 0 && (
        <div className="p-5 rounded-md border border-amber-500/30 bg-amber-500/10 text-xs sm:text-sm text-amber-900 dark:text-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <FileCheck2 className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">
                {awaitingLogBookings.length} Completed Session{awaitingLogBookings.length > 1 ? "s" : ""} Pending Work Log Entry
              </span>
              <p className="text-xs text-amber-800 dark:text-amber-200 font-light leading-relaxed">
                Your machine time has concluded. Please document what protocol you performed, actual hours, and observations so your supervisor can sign off on your hours.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleOpenLogModal(awaitingLogBookings[0])}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 shadow-xs transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Update Now ({awaitingLogBookings[0].equipment.name})</span>
          </button>
        </div>
      )}

      {/* 3. Verification Alert if Still Pending */}
      {isPending && (
        <div className="p-5 rounded-md border border-amber-500/30 bg-amber-500/10 text-xs sm:text-sm text-amber-800 dark:text-amber-200 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Account Awaiting Faculty Verification</span>
            <p className="font-light leading-relaxed text-xs">
              Your registration dossier has been submitted and is currently being reviewed by your assigned thesis supervisor or lab administration. Instrument reservations will unlock automatically as soon as your account is approved.
            </p>
          </div>
        </div>
      )}

      {/* 4. Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <span>Upcoming Reservations</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-sans text-[var(--text-primary)]">
            {upcomingBookings.length}
          </div>
          <span className="text-[11px] text-[var(--text-muted)] block">Confirmed slots in queue</span>
        </div>

        <div className="p-5 sm:p-6 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <span>Cumulative Machine Time</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-sans text-[var(--text-primary)]">
            {Math.round(totalHours * 10) / 10} <span className="text-base font-normal text-[var(--text-muted)]">hrs</span>
          </div>
          <span className="text-[11px] text-[var(--text-muted)] block">Documented in official thesis logbook</span>
        </div>

        <div className="p-5 sm:p-6 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <span>Logged Experiments</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-sans text-[var(--text-primary)]">
            {completedBookings.length}
          </div>
          <span className="text-[11px] text-[var(--text-muted)] block">Completed experimental runs</span>
        </div>
      </div>

      {/* 5. Main Equipment Usage & Reservations Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-black font-sans text-[var(--text-primary)] flex items-center gap-2">
              <Microscope className="w-5 h-5 text-emerald-500" />
              <span>Equipment Reservations &amp; Run History</span>
            </h2>

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
                onClick={() => setActiveFilter("UPCOMING")}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  activeFilter === "UPCOMING"
                    ? "bg-[var(--brand-primary)] text-white shadow-2xs font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Upcoming ({upcomingBookings.length})
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
                  <span className="px-1 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-bold">
                    {awaitingLogBookings.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("COMPLETED")}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  activeFilter === "COMPLETED"
                    ? "bg-[var(--brand-primary)] text-white shadow-2xs font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Completed ({completedBookings.length})
              </button>
            </div>
          </div>

          {displayedBookings.length === 0 ? (
            <div className="p-8 rounded-md border border-dashed border-[var(--border)] bg-[var(--surface)] text-center text-xs text-[var(--text-muted)] space-y-3">
              <Calendar className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
              <div>
                <span className="font-semibold block text-[var(--text-secondary)]">No reservations found in this view</span>
                <span>You do not have any bookings matching this filter.</span>
              </div>
              {!isPending && (
                <Link
                  href="/portal/book"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold bg-[var(--surface-raised)] hover:bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Reserve an Instrument Now</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {displayedBookings.map((b) => {
                const isPast = new Date(b.endTime) <= now;
                const hasLog = Boolean(b.experimentLog);

                return (
                  <div
                    key={b.id}
                    className="p-4 sm:p-5 rounded-md border border-[var(--border)] bg-[var(--surface)] hover:border-emerald-500/40 transition-all shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-[var(--text-primary)]">
                          {b.equipment.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--surface-raised)] text-[var(--text-secondary)] border border-[var(--border)]">
                          {b.equipment.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                            b.status === "CONFIRMED"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : b.status === "COMPLETED"
                              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                              : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <div className="text-xs text-[var(--text-secondary)] space-y-1">
                        <p className="font-light">
                          <span className="font-mono text-[var(--text-muted)] uppercase text-[10px] mr-1">Purpose:</span>
                          {b.purpose}
                        </p>
                        {b.samples && (
                          <p className="font-mono text-[11px] text-[var(--text-muted)]">
                            <span className="uppercase text-[10px] mr-1">Samples:</span>
                            {b.samples}
                          </p>
                        )}
                      </div>

                      <div className="text-[11px] font-mono text-[var(--text-muted)] flex flex-wrap items-center gap-3 pt-1">
                        <span>📅 {new Date(b.startTime).toLocaleDateString()}</span>
                        <span>
                          ⏰ {new Date(b.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
                          {new Date(b.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      {/* Attached Post-Run Log Snippet if completed */}
                      {hasLog && b.experimentLog && (
                        <div className="mt-2.5 p-3 rounded-md bg-[var(--surface-raised)]/70 border border-[var(--border)] space-y-1 text-xs">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                              <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{b.experimentLog.title}</span>
                            </span>
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                              {b.experimentLog.actualHoursUsed} hrs actual
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                            {b.experimentLog.protocolSummary}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Button: Update Work Log or View Results */}
                    <div className="shrink-0 flex flex-col gap-2 self-start sm:self-center">
                      {!hasLog && (isPast || b.status === "COMPLETED") ? (
                        <button
                          type="button"
                          onClick={() => handleOpenLogModal(b)}
                          className="px-4 py-2 rounded-md text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Record Work Done</span>
                        </button>
                      ) : hasLog ? (
                        <button
                          type="button"
                          onClick={() => handleOpenLogModal(b)}
                          className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[var(--surface-raised)] hover:bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] transition-all flex items-center gap-1.5"
                        >
                          <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Edit Work Log</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-md text-xs font-mono text-[var(--text-muted)] bg-[var(--surface-raised)]/40 border border-[var(--border)] text-center">
                          Awaiting Slot Start
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 6. Right Column: Notices Widget & Scholar Academic Profile Card */}
        <div className="space-y-6">
          {/* Lab Announcements & Bulletins Widget */}
          {notices.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black font-sans text-[var(--text-primary)] flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[var(--brand-primary)]" />
                  <span>Lab Bulletins</span>
                </h2>
                <Link
                  href="/portal/notices"
                  className="text-xs font-semibold text-[var(--brand-primary)] hover:underline inline-flex items-center gap-1"
                >
                  <span>View all ({notices.length})</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-4 sm:p-5 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-3.5 text-xs">
                {notices.slice(0, 3).map((n) => (
                  <div
                    key={n.id}
                    className="pb-3 border-b border-[var(--border)] last:border-0 last:pb-0 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                      {n.pinned ? (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                          PINNED
                        </span>
                      ) : n.priority === "URGENT" ? (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-500 text-white">
                          URGENT
                        </span>
                      ) : null}
                    </div>

                    <Link
                      href="/portal/notices"
                      className="font-bold text-xs text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-colors block line-clamp-1"
                    >
                      {n.title}
                    </Link>

                    <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 font-light leading-relaxed">
                      {n.content}
                    </p>
                  </div>
                ))}

                <Link
                  href="/portal/notices"
                  className="w-full pt-2 border-t border-[var(--border)] text-center text-xs font-semibold text-[var(--brand-primary)] hover:underline block"
                >
                  Browse all notices &amp; updates →
                </Link>
              </div>
            </div>
          )}

          {/* Scholar Academic Profile Card */}
          <div className="space-y-3">
            <h2 className="text-lg font-black font-sans text-[var(--text-primary)] flex items-center gap-2">
              <User className="w-5 h-5 text-sky-500" />
              <span>Academic Dossier</span>
            </h2>

            <div className="p-5 sm:p-6 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-xs font-mono text-[var(--text-muted)] block uppercase">Research Thesis Topic</span>
                <p className="font-semibold text-[var(--text-primary)] leading-relaxed">
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
                  <span className="text-[var(--text-muted)]">Email:</span>
                  <span className="text-[var(--text-primary)] truncate max-w-[150px]">{userEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Phone:</span>
                  <span className="text-[var(--text-primary)]">{profile?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Supervisor:</span>
                  <span className="text-[var(--brand-primary)] font-sans font-medium text-right truncate max-w-[150px]">
                    {profile?.supervisor?.user.name || profile?.supervisorName || "Assigned Faculty"}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex flex-col gap-2">
                <Link
                  href="/portal/profile"
                  className="w-full py-2.5 rounded-md text-xs font-semibold bg-[var(--surface-raised)] hover:bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View Full Academic Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/portal/sops"
                  className="w-full py-2 rounded-md text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-all text-center"
                >
                  Lab Safety SOPs &amp; Guidelines →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post-Run Work Log Modal */}
      <PostRunLogModal
        booking={selectedBookingForLog}
        open={logModalOpen}
        onOpenChange={setLogModalOpen}
      />
    </div>
  );
}
