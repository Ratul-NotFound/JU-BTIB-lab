"use client";

import * as React from "react";
import Link from "next/link";
import { NoticeCategory, NoticePriority, NoticeAudience, Role } from "@prisma/client";
import {
  Bell,
  Pin,
  AlertTriangle,
  Clock,
  Calendar,
  Search,
  GraduationCap,
  Megaphone,
  ShieldAlert,
  ArrowRight,
  CalendarDays,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PortalNoticeItem {
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

interface PortalNoticesClientProps {
  notices: PortalNoticeItem[];
  userRole?: Role;
}

const CATEGORY_META: Record<
  NoticeCategory,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  GENERAL: {
    label: "General Announcements",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: Megaphone,
  },
  SAFETY_ALERT: {
    label: "Safety & Biohazard",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: AlertTriangle,
  },
  EQUIPMENT_DOWNTIME: {
    label: "Equipment & Maintenance",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: Clock,
  },
  SEMINAR_EVENT: {
    label: "Seminars & Workshops",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: Calendar,
  },
  DEADLINE: {
    label: "Academic Deadlines",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    icon: GraduationCap,
  },
};

const PRIORITY_META: Record<NoticePriority, { label: string; badge: string }> = {
  URGENT: { label: "Urgent Alert", badge: "bg-rose-600 text-white font-bold animate-pulse" },
  HIGH: { label: "High Priority", badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold" },
  NORMAL: { label: "Standard", badge: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20" },
  LOW: { label: "Informational", badge: "bg-zinc-500/5 text-zinc-500 border-transparent" },
};

export function PortalNoticesClient({ notices, userRole }: PortalNoticesClientProps) {
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("ALL");
  const [urgentOnly, setUrgentOnly] = React.useState(false);

  const isAdmin = userRole === Role.SUPER_ADMIN || userRole === Role.EDITOR;

  // Filtered list
  const filteredNotices = React.useMemo(() => {
    return notices.filter((n) => {
      // Category filter
      if (selectedCategory !== "ALL" && n.category !== selectedCategory) {
        return false;
      }
      // Urgent filter
      if (urgentOnly && n.priority !== NoticePriority.URGENT && n.priority !== NoticePriority.HIGH) {
        return false;
      }
      // Search term
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const matchesTitle = n.title.toLowerCase().includes(query);
        const matchesContent = n.content.toLowerCase().includes(query);
        const matchesAuthor = (n.authorName || "").toLowerCase().includes(query);
        if (!matchesTitle && !matchesContent && !matchesAuthor) return false;
      }
      return true;
    });
  }, [notices, selectedCategory, urgentOnly, search]);

  const pinnedNotices = React.useMemo(() => {
    return filteredNotices.filter((n) => n.pinned);
  }, [filteredNotices]);

  const regularNotices = React.useMemo(() => {
    return filteredNotices.filter((n) => !n.pinned);
  }, [filteredNotices]);

  const urgentCount = notices.filter(
    (n) => n.priority === NoticePriority.URGENT || n.priority === NoticePriority.HIGH
  ).length;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* 1. Page Header */}
      <div className="p-6 sm:p-8 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-mono font-semibold bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              <span>Official Bulletin Board</span>
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-muted)]">
              {notices.length} Active {notices.length === 1 ? "Notice" : "Notices"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[var(--text-primary)]">
            Laboratory Notices &amp; Announcements
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
            Stay informed with official broadcasts regarding lab safety protocols, autoclave &amp; instrument maintenance downtime, academic thesis deadlines, and guest symposiums.
          </p>
        </div>

        {/* Admin Quick Action */}
        {isAdmin && (
          <div className="shrink-0 relative z-10">
            <Link
              href="/admin/notices"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shadow-xs transition-all active:scale-[0.98]"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Manage &amp; Post Notices</span>
            </Link>
          </div>
        )}
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search notices by keyword, title, protocol, or faculty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Urgent Priority Filter Toggle */}
          <button
            type="button"
            onClick={() => setUrgentOnly((prev) => !prev)}
            className={cn(
              "px-3.5 py-2 rounded-md text-xs font-medium border flex items-center justify-center gap-2 transition-all shadow-2xs shrink-0",
              urgentOnly
                ? "bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold"
                : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            <AlertTriangle className={cn("w-3.5 h-3.5", urgentOnly ? "text-rose-500" : "text-[var(--text-muted)]")} />
            <span>Urgent / High Priority</span>
            {urgentCount > 0 && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-rose-500 text-white">
                {urgentCount}
              </span>
            )}
          </button>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all border shrink-0",
              selectedCategory === "ALL"
                ? "bg-[var(--surface-raised)] text-[var(--brand-primary)] border-[var(--brand-primary)]/40 shadow-xs font-bold"
                : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]"
            )}
          >
            All Categories ({notices.length})
          </button>

          {(Object.keys(CATEGORY_META) as NoticeCategory[]).map((cat) => {
            const meta = CATEGORY_META[cat];
            const Icon = meta.icon;
            const count = notices.filter((n) => n.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-1.5 shrink-0",
                  isSelected
                    ? "bg-[var(--surface-raised)] text-[var(--brand-primary)] border-[var(--brand-primary)]/40 shadow-xs font-bold"
                    : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{meta.label}</span>
                <span className="font-mono text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Pinned Announcements (Hero Section) */}
      {pinnedNotices.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--brand-primary)] font-bold">
            <Pin className="w-4 h-4 fill-current rotate-45" />
            <span>Pinned Laboratory Notices</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {pinnedNotices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} isPinnedHero={true} />
            ))}
          </div>
        </div>
      )}

      {/* 4. Regular Active Notices Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
          <span>
            {pinnedNotices.length > 0 ? "All General Bulletins" : "Recent Bulletins"} (
            {regularNotices.length})
          </span>
          {filteredNotices.length > 0 && (
            <span>Sorted by priority &amp; recency</span>
          )}
        </div>

        {filteredNotices.length === 0 ? (
          <div className="p-12 rounded-md border border-[var(--border)] bg-[var(--surface)] text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[var(--surface-raised)] flex items-center justify-center mx-auto text-[var(--text-muted)]">
              <Bell className="w-6 h-6 opacity-40" />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">No notices found</h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
              {search || selectedCategory !== "ALL" || urgentOnly
                ? "No lab notices match your current filters. Try searching with different terms or reset your filter."
                : "There are currently no active public notices posted. Check back soon for departmental updates."}
            </p>
            {(search || selectedCategory !== "ALL" || urgentOnly) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("ALL");
                  setUrgentOnly(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--surface-raised)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] transition-all shadow-xs"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {regularNotices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single Notice Card Component
// ---------------------------------------------------------------------------

function NoticeCard({
  notice,
  isPinnedHero = false,
}: {
  notice: PortalNoticeItem;
  isPinnedHero?: boolean;
}) {
  const [expanded, setExpanded] = React.useState(false);

  const catMeta = CATEGORY_META[notice.category] || CATEGORY_META.GENERAL;
  const CategoryIcon = catMeta.icon;
  const priorityMeta = PRIORITY_META[notice.priority] || PRIORITY_META.NORMAL;

  const createdDate = new Date(notice.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const expiresDate = notice.expiresAt
    ? new Date(notice.expiresAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const isLongContent = notice.content.length > 280;

  return (
    <article
      className={cn(
        "rounded-md border p-5 sm:p-6 transition-all shadow-xs relative overflow-hidden",
        isPinnedHero
          ? "bg-[var(--surface)] border-[var(--brand-primary)]/40 ring-1 ring-[var(--brand-primary)]/20 shadow-sm"
          : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-strong)]"
      )}
    >
      {/* Decorative top accent for hero pinned cards */}
      {isPinnedHero && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--bio-teal)]" />
      )}

      <div className="space-y-3.5">
        {/* Top Badges & Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Badge */}
            <span
              className={cn(
                "px-2.5 py-0.5 rounded text-[11px] font-mono font-medium border flex items-center gap-1.5",
                catMeta.color
              )}
            >
              <CategoryIcon className="w-3 h-3" />
              <span>{catMeta.label}</span>
            </span>

            {/* Priority Badge */}
            {notice.priority !== NoticePriority.NORMAL && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border",
                  priorityMeta.badge
                )}
              >
                {priorityMeta.label}
              </span>
            )}

            {/* Pinned Badge */}
            {notice.pinned && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 flex items-center gap-1">
                <Pin className="w-2.5 h-2.5 fill-current rotate-45" />
                <span>Pinned</span>
              </span>
            )}

            {/* Target Audience Badge if constrained */}
            {notice.targetAudience === NoticeAudience.STUDENTS_ONLY && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                <GraduationCap className="w-2.5 h-2.5" />
                <span>Scholars Only</span>
              </span>
            )}
            {notice.targetAudience === NoticeAudience.FACULTY_ONLY && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 flex items-center gap-1">
                <UserCheck className="w-2.5 h-2.5" />
                <span>Faculty Only</span>
              </span>
            )}
          </div>

          {/* Date & Expiration */}
          <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{createdDate}</span>
            </span>

            {expiresDate && (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Clock className="w-3 h-3" />
                <span>Expires {expiresDate}</span>
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-base sm:text-lg font-bold font-sans tracking-tight text-[var(--text-primary)]">
          {notice.title}
        </h2>

        {/* Content Body */}
        <div className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
          <p
            className={cn(
              "whitespace-pre-line",
              !expanded && isLongContent && "line-clamp-4"
            )}
          >
            {notice.content}
          </p>

          {isLongContent && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="mt-2 text-xs font-semibold text-[var(--brand-primary)] hover:underline inline-flex items-center gap-1"
            >
              <span>{expanded ? "Show less" : "Read full notice"}</span>
              <ArrowRight className={cn("w-3 h-3 transition-transform", expanded && "rotate-90")} />
            </button>
          )}
        </div>

        {/* Author / Origin Signature */}
        <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span className="font-mono uppercase text-[10px]">Posted By:</span>
            <span className="font-medium text-[var(--text-primary)]">
              {notice.authorName || "Lab Administration · Jahangirnagar University"}
            </span>
          </div>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            Ref: #{notice.id.slice(0, 8)}
          </span>
        </div>
      </div>
    </article>
  );
}
