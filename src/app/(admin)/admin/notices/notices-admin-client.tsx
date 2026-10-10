"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createNoticeAction,
  updateNoticeAction,
  deleteNoticeAction,
  togglePinNoticeAction,
  togglePublishNoticeAction,
  NoticeInput,
} from "@/server/actions/notices";
import { NoticeCategory, NoticePriority, NoticeAudience } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";
import {
  Bell,
  PlusCircle,
  Pin,
  AlertTriangle,
  Clock,
  Calendar,
  Search,
  CheckCircle2,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Users,
  GraduationCap,
  ExternalLink,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface LabNoticeItem {
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

interface NoticesAdminClientProps {
  initialNotices: LabNoticeItem[];
  adminName: string;
}

const CATEGORY_META: Record<
  NoticeCategory,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  GENERAL: {
    label: "General Announcement",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: Megaphone,
  },
  SAFETY_ALERT: {
    label: "Lab Safety Alert",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: AlertTriangle,
  },
  EQUIPMENT_DOWNTIME: {
    label: "Maintenance Downtime",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: Clock,
  },
  SEMINAR_EVENT: {
    label: "Seminar & Event",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: Calendar,
  },
  DEADLINE: {
    label: "Academic Deadline",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    icon: GraduationCap,
  },
};

const PRIORITY_META: Record<NoticePriority, { label: string; badge: string }> = {
  URGENT: { label: "Urgent Alert", badge: "bg-rose-500 text-white font-bold animate-pulse" },
  HIGH: { label: "High Priority", badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold" },
  NORMAL: { label: "Normal", badge: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20" },
  LOW: { label: "Low", badge: "bg-zinc-500/5 text-zinc-500 border-transparent" },
};

export function NoticesAdminClient({ initialNotices, adminName }: NoticesAdminClientProps) {
  const router = useRouter();
  const [notices, setNotices] = React.useState<LabNoticeItem[]>(initialNotices);

  React.useEffect(() => {
    setNotices(initialNotices);
  }, [initialNotices]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");

  // Modal State
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingNotice, setEditingNotice] = React.useState<LabNoticeItem | null>(null);

  // Form State
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [category, setCategory] = React.useState<NoticeCategory>(NoticeCategory.GENERAL);
  const [priority, setPriority] = React.useState<NoticePriority>(NoticePriority.NORMAL);
  const [targetAudience, setTargetAudience] = React.useState<NoticeAudience>(NoticeAudience.ALL);
  const [pinned, setPinned] = React.useState(false);
  const [published, setPublished] = React.useState(true);
  const [expiresAt, setExpiresAt] = React.useState("");
  const [authorName, setAuthorName] = React.useState(adminName || "Lab Administration");

  const [submitting, setSubmitting] = React.useState(false);
  const [actionMessage, setActionMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const resetForm = () => {
    setEditingNotice(null);
    setTitle("");
    setContent("");
    setCategory(NoticeCategory.GENERAL);
    setPriority(NoticePriority.NORMAL);
    setTargetAudience(NoticeAudience.ALL);
    setPinned(false);
    setPublished(true);
    setExpiresAt("");
    setAuthorName(adminName || "Lab Administration");
  };

  const handleOpenCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleOpenEdit = (n: LabNoticeItem) => {
    setEditingNotice(n);
    setTitle(n.title);
    setContent(n.content);
    setCategory(n.category);
    setPriority(n.priority);
    setTargetAudience(n.targetAudience);
    setPinned(n.pinned);
    setPublished(n.published);
    setExpiresAt(n.expiresAt ? new Date(n.expiresAt).toISOString().split("T")[0] : "");
    setAuthorName(n.authorName || adminName || "Lab Administration");
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setActionMessage(null);

    try {
      const payload: NoticeInput = {
        title,
        content,
        category,
        priority,
        targetAudience,
        pinned,
        published,
        expiresAt: expiresAt ? expiresAt : null,
        authorName,
      };

      if (editingNotice) {
        const res = await updateNoticeAction(editingNotice.id, payload);
        if (res.success && res.notice) {
          setActionMessage({ type: "success", text: "Notice updated successfully." });
          setNotices((prev) => prev.map((item) => (item.id === editingNotice.id ? (res.notice as LabNoticeItem) : item)));
          setDialogOpen(false);
          router.refresh();
        } else {
          setActionMessage({ type: "error", text: res.error || "Failed to update notice." });
        }
      } else {
        const res = await createNoticeAction(payload);
        if (res.success && res.notice) {
          setActionMessage({ type: "success", text: "Notice posted successfully." });
          setNotices((prev) => [res.notice as LabNoticeItem, ...prev]);
          setDialogOpen(false);
          resetForm();
          router.refresh();
        } else {
          setActionMessage({ type: "error", text: res.error || "Failed to create notice." });
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setActionMessage({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      const res = await togglePinNoticeAction(id);
      if (res.success) {
        setNotices((prev) =>
          prev.map((item) => (item.id === id ? { ...item, pinned: Boolean(res.pinned) } : item))
        );
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await togglePublishNoticeAction(id);
      if (res.success) {
        setNotices((prev) =>
          prev.map((item) => (item.id === id ? { ...item, published: Boolean(res.published) } : item))
        );
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, noticeTitle: string) => {
    if (!confirm(`Are you sure you want to delete the notice "${noticeTitle}"?`)) return;

    try {
      const res = await deleteNoticeAction(id);
      if (res.success) {
        setNotices((prev) => prev.filter((item) => item.id !== id));
        setActionMessage({ type: "success", text: `Notice "${noticeTitle}" deleted.` });
        router.refresh();
      } else {
        setActionMessage({ type: "error", text: res.error || "Failed to delete notice." });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete failed.";
      setActionMessage({ type: "error", text: msg });
    }
  };

  // Filter calculations
  const filteredNotices = notices.filter((n) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchContent = n.content.toLowerCase().includes(q);
      const matchAuthor = n.authorName?.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchAuthor) return false;
    }
    if (categoryFilter !== "ALL" && n.category !== categoryFilter) return false;
    if (priorityFilter !== "ALL" && n.priority !== priorityFilter) return false;
    if (statusFilter === "PUBLISHED" && !n.published) return false;
    if (statusFilter === "DRAFT" && n.published) return false;
    if (statusFilter === "PINNED" && !n.pinned) return false;
    return true;
  });

  const totalNotices = notices.length;
  const publishedCount = notices.filter((n) => n.published).length;
  const pinnedCount = notices.filter((n) => n.pinned && n.published).length;
  const urgentCount = notices.filter((n) => n.priority === NoticePriority.URGENT && n.published).length;

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="specimen-tag text-[10px] py-0 px-2 font-bold uppercase">
              Broadcast System
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              {publishedCount} Active in Portal
            </span>
          </div>

          <h1 className="text-2xl font-bold font-sans tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            <Bell className="w-6 h-6 text-[var(--brand-primary)]" />
            <span>Lab Notices & Announcements Console</span>
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-light">
            Broadcast official notices, laboratory safety alerts, instrument downtime schedules, and thesis deadlines.
            Announcements are immediately visible in the <Link href="/portal/notices" className="text-[var(--bio-teal)] underline underline-offset-2 font-medium">Scholar & Faculty Portal</Link>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/portal/notices"
            target="_blank"
            className="text-xs px-3.5 py-2.5 rounded-md border border-[var(--border)] hover:bg-[var(--surface-raised)] flex items-center gap-1.5 font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Preview how scholars see notices in the portal"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview in Portal</span>
          </Link>

          <Button
            onClick={handleOpenCreate}
            className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-xs px-4 py-2.5 rounded-md flex items-center gap-2 shadow-sm font-semibold"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Notice</span>
          </Button>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-2xs space-y-1">
          <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
            Total Notices
          </div>
          <div className="text-2xl font-bold font-sans text-[var(--text-primary)]">
            {totalNotices}
          </div>
        </div>

        <div className="p-4 rounded-md border border-emerald-500/20 bg-emerald-500/5 shadow-2xs space-y-1">
          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Live in Portal
          </div>
          <div className="text-2xl font-bold font-sans text-emerald-700 dark:text-emerald-300">
            {publishedCount}
          </div>
        </div>

        <div className="p-4 rounded-md border border-purple-500/20 bg-purple-500/5 shadow-2xs space-y-1">
          <div className="text-[11px] font-mono text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            Pinned Announcements
          </div>
          <div className="text-2xl font-bold font-sans text-purple-700 dark:text-purple-300">
            {pinnedCount}
          </div>
        </div>

        <div className="p-4 rounded-md border border-rose-500/20 bg-rose-500/5 shadow-2xs space-y-1">
          <div className="text-[11px] font-mono text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            Urgent Safety Alerts
          </div>
          <div className="text-2xl font-bold font-sans text-rose-700 dark:text-rose-300">
            {urgentCount}
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {actionMessage && (
        <div
          className={cn(
            "p-4 rounded-md text-xs flex items-center justify-between border",
            actionMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-200"
              : "bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-200"
          )}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-[11px] underline opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Search and Filter Bar */}
      <div className="p-4 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <Input
            type="text"
            placeholder="Search notice title, content, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-[var(--surface-raised)] border-[var(--border)]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 px-2.5 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] text-xs"
          >
            <option value="ALL">All Categories</option>
            <option value="GENERAL">General Announcements</option>
            <option value="SAFETY_ALERT">Safety Alerts</option>
            <option value="EQUIPMENT_DOWNTIME">Equipment Downtimes</option>
            <option value="SEMINAR_EVENT">Seminars & Events</option>
            <option value="DEADLINE">Academic Deadlines</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-9 px-2.5 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] text-xs"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent Alerts</option>
            <option value="HIGH">High Priority</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-2.5 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published (Live)</option>
            <option value="DRAFT">Draft (Hidden)</option>
            <option value="PINNED">Pinned to Top</option>
          </select>
        </div>
      </div>

      {/* 4. Table of Notices */}
      {filteredNotices.length === 0 ? (
        <div className="p-12 text-center rounded-md border border-dashed border-[var(--border)] bg-[var(--surface)] space-y-2">
          <Bell className="w-10 h-10 text-[var(--text-secondary)] mx-auto opacity-40" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">No notices found</p>
          <p className="text-xs text-[var(--text-secondary)]">
            Click &quot;Post New Notice&quot; above to broadcast your first announcement to scholars and faculty.
          </p>
        </div>
      ) : (
        <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]/50 text-[var(--text-secondary)] font-mono uppercase tracking-wider">
                  <th className="p-3 pl-4 w-10 text-center">Pin</th>
                  <th className="p-3">Notice Title & Preview</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Audience</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Posted Date</th>
                  <th className="p-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredNotices.map((n) => {
                  const catMeta = CATEGORY_META[n.category] || CATEGORY_META.GENERAL;
                  const priMeta = PRIORITY_META[n.priority] || PRIORITY_META.NORMAL;
                  const CatIcon = catMeta.icon;

                  return (
                    <tr key={n.id} className="hover:bg-[var(--surface-raised)]/30 transition-colors">
                      {/* Pinned Toggle */}
                      <td className="p-3 pl-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePin(n.id)}
                          className={cn(
                            "p-1.5 rounded transition-colors",
                            n.pinned
                              ? "text-purple-600 hover:text-purple-700 bg-purple-500/10"
                              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
                          )}
                          title={n.pinned ? "Pinned to Portal Top (Click to unpin)" : "Click to pin to Portal Top"}
                        >
                          {n.pinned ? <Pin className="w-3.5 h-3.5 fill-current" /> : <Pin className="w-3.5 h-3.5 opacity-40" />}
                        </button>
                      </td>

                      {/* Title & Preview */}
                      <td className="p-3 max-w-sm">
                        <div className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                          {n.pinned && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/25">
                              PINNED
                            </span>
                          )}
                          <span className="truncate">{n.title}</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                          {n.content}
                        </p>
                        <div className="text-[10px] text-[var(--text-muted)] mt-1 font-mono flex items-center gap-1.5">
                          <span>By {n.authorName || "Lab Administration"}</span>
                          {n.expiresAt && (
                            <>
                              <span>•</span>
                              <span className="text-amber-600 dark:text-amber-400">
                                Expires {new Date(n.expiresAt).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3">
                        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium border", catMeta.color)}>
                          <CatIcon className="w-3 h-3 shrink-0" />
                          <span>{catMeta.label}</span>
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="p-3">
                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-mono font-semibold border inline-block", priMeta.badge)}>
                          {priMeta.label}
                        </span>
                      </td>

                      {/* Audience */}
                      <td className="p-3">
                        <span className="text-[11px] font-medium text-[var(--text-secondary)] flex items-center gap-1">
                          <Users className="w-3 h-3 text-[var(--text-muted)]" />
                          <span>
                            {n.targetAudience === NoticeAudience.ALL
                              ? "All Members"
                              : n.targetAudience === NoticeAudience.STUDENTS_ONLY
                              ? "Scholars Only"
                              : "Faculty Only"}
                          </span>
                        </span>
                      </td>

                      {/* Published Status */}
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(n.id)}
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold border transition-all cursor-pointer",
                            n.published
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20 hover:bg-zinc-500/20"
                          )}
                          title="Click to toggle published visibility"
                        >
                          {n.published ? (
                            <>
                              <Eye className="w-3 h-3 text-emerald-600" />
                              <span>LIVE</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-zinc-400" />
                              <span>HIDDEN</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Date Conducted */}
                      <td className="p-3 text-[11px] font-mono text-[var(--text-muted)] whitespace-nowrap">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </td>

                      {/* Action buttons */}
                      <td className="p-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(n)}
                            className="p-1.5 rounded hover:bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            title="Edit notice"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(n.id, n.title)}
                            className="p-1.5 rounded hover:bg-rose-500/10 text-[var(--text-secondary)] hover:text-rose-600 transition-colors"
                            title="Delete notice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* 5. Create / Edit Notice Modal Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingNotice ? "Edit Notice & Alert" : "Post Laboratory Notice"}
        description="Broadcast official guidelines, safety updates, and equipment schedules to student scholars and faculty."
        size="2xl"
      >
        <div className="pt-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Notice Title *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Autoclave System Maintenance & Safety Downtime"
                required
                className="bg-[var(--surface-raised)] border-[var(--border)] text-sm font-medium"
              />
            </div>

            {/* Category & Priority Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                  className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] text-xs"
                  required
                >
                  <option value={NoticeCategory.GENERAL}>General Announcement</option>
                  <option value={NoticeCategory.SAFETY_ALERT}>Lab Safety Alert</option>
                  <option value={NoticeCategory.EQUIPMENT_DOWNTIME}>Equipment Downtime</option>
                  <option value={NoticeCategory.DEADLINE}>Academic Deadline</option>
                  <option value={NoticeCategory.SEMINAR_EVENT}>Seminar & Event</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Priority Level *
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as NoticePriority)}
                  className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] text-xs"
                  required
                >
                  <option value={NoticePriority.NORMAL}>Normal</option>
                  <option value={NoticePriority.HIGH}>High Priority</option>
                  <option value={NoticePriority.URGENT}>Urgent Alert (Highlighted Banner)</option>
                  <option value={NoticePriority.LOW}>Low</option>
                </select>
              </div>
            </div>

            {/* Target Audience & Author Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as NoticeAudience)}
                  className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] text-xs"
                >
                  <option value={NoticeAudience.ALL}>All Lab Members (Scholars & Faculty)</option>
                  <option value={NoticeAudience.STUDENTS_ONLY}>Students & Scholars Only</option>
                  <option value={NoticeAudience.FACULTY_ONLY}>Faculty Supervisors Only</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Author / Authority Name
                </label>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Lab Director / Administration"
                  className="bg-[var(--surface-raised)] border-[var(--border)] text-xs"
                />
              </div>
            </div>

            {/* Expiry Date (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Auto-Expire Date (Optional)
              </label>
              <Input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="bg-[var(--surface-raised)] border-[var(--border)] text-xs"
              />
              <p className="text-[10px] text-[var(--text-muted)]">
                Leave empty for standing announcements with no automated expiration.
              </p>
            </div>

            {/* Content Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Notice Content / Body *
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter detailed notice, instructions, safety precautions, or schedule details..."
                rows={5}
                required
                className="bg-[var(--surface-raised)] border-[var(--border)] text-xs leading-relaxed"
              />
            </div>

            {/* Checkboxes: Pinned & Published */}
            <div className="pt-2 border-t border-[var(--border)] grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-primary)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="rounded border-[var(--border)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] w-4 h-4"
                />
                <span>Pin to Portal Top Banner</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-primary)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded border-[var(--border)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] w-4 h-4"
                />
                <span>Published (Immediately Live)</span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-xs px-5 font-semibold"
              >
                {submitting
                  ? "Saving..."
                  : editingNotice
                  ? "Update Notice"
                  : "Publish Notice to Portal"}
              </Button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
}
