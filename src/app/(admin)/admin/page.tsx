import Link from "next/link";
import { db } from "@/lib/db";
import { SpecimenLabel } from "@/components/ui/specimen-label";
import {
  FlaskConical,
  FolderGit2,
  BookOpen,
  Users,
  Calendar,
  Image as ImageIcon,
  FileText,
  Inbox,
  Settings,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    areasCount,
    projectsCount,
    publicationsCount,
    teamCount,
    activitiesCount,
    postsCount,
    unreadMessagesCount,
    recentAudits,
  ] = await Promise.all([
    db.researchArea.count(),
    db.project.count(),
    db.publication.count(),
    db.teamMember.count(),
    db.activity.count(),
    db.blogPost.count(),
    db.contactMessage.count({ where: { status: "NEW" } }),
    db.auditLog.findMany({
      take: 6,
      orderBy: { timestamp: "desc" },
    }),
  ]);

  const STATS = [
    {
      title: "Research Areas",
      count: areasCount,
      href: "/admin/research-areas",
      icon: FlaskConical,
      tag: "8 DISCIPLINES",
    },
    {
      title: "Projects",
      count: projectsCount,
      href: "/admin/projects",
      icon: FolderGit2,
      tag: "RESEARCH",
    },
    {
      title: "Publications",
      count: publicationsCount,
      href: "/admin/publications",
      icon: BookOpen,
      tag: "SCHOLARLY",
    },
    {
      title: "Team Members",
      count: teamCount,
      href: "/admin/team",
      icon: Users,
      tag: "PERSONNEL",
    },
    {
      title: "Activities & Events",
      count: activitiesCount,
      href: "/admin/activities",
      icon: Calendar,
      tag: "ACADEMIC",
    },
    {
      title: "Articles & Blog",
      count: postsCount,
      href: "/admin/blog",
      icon: FileText,
      tag: "EDITORIAL",
    },
    {
      title: "Contact Inbox",
      count: unreadMessagesCount,
      href: "/admin/inbox",
      icon: Inbox,
      tag: `${unreadMessagesCount} UNREAD`,
      highlight: unreadMessagesCount > 0,
    },
    {
      title: "Media Assets",
      count: "Cloudinary",
      href: "/admin/media",
      icon: ImageIcon,
      tag: "STORAGE",
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <SpecimenLabel code="CONSOLE / 2026" subtext="ACTIVE" />
            <span className="text-xs font-mono text-[var(--bio-teal)]">
              JAHANGIRNAGAR UNIVERSITY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            BTIB Management Dashboard
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Real-time repository statistics, content administration, and security audit log.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-raised)] transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Site Settings</span>
          </Link>
          <Link
            href="/admin/audit-logs"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-raised)] transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </Link>
        </div>
      </div>

      {/* Grid of Content Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className={`p-5 rounded border bg-[var(--surface)] hover:border-[var(--bio-teal)] transition-all group flex flex-col justify-between ${
                stat.highlight
                  ? "border-[var(--bio-teal)] ring-1 ring-[var(--bio-teal)]/30"
                  : "border-[var(--border)]"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded border border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--bio-teal)] group-hover:border-[var(--bio-teal)] transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="specimen-tag text-[9px]">{stat.tag}</span>
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                    {stat.count}
                  </div>
                  <div className="text-xs font-medium text-[var(--text-muted)]">
                    {stat.title}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border)] mt-4 flex items-center justify-between text-xs text-[var(--bio-teal)] font-mono">
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Security & Activity Audit Log */}
      <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[var(--bio-teal)]" />
            <h3 className="font-semibold text-sm text-[var(--text-primary)]">
              Recent Repository Activity Log
            </h3>
          </div>
          <Link
            href="/admin/audit-logs"
            className="text-xs font-mono text-[var(--bio-teal)] hover:underline"
          >
            View Full Trail →
          </Link>
        </div>

        {recentAudits.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)] font-mono py-4 text-center">
            No audit records logged yet.
          </p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {recentAudits.map((log) => (
              <div
                key={log.id}
                className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="specimen-tag text-[9px] py-0 px-1">
                    {log.action}
                  </span>
                  <span className="font-medium text-[var(--text-primary)]">
                    {log.entity}
                  </span>
                  <span className="text-[var(--text-muted)]">
                    by {log.userName || "System"}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[var(--text-muted)]">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
