"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Microscope,
  BookOpen,
  User,
  ShieldCheck,
  GraduationCap,
  CheckSquare,
  ShieldAlert,
  Calendar,
  Clock,
  ArrowLeft,
  LogOut,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";
import { Role, AccountStatus } from "@prisma/client";
import { logoutAction } from "@/server/actions/auth";
import { cn } from "@/lib/utils";

export interface PortalSidebarProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: Role;
  };
  studentProfile?: {
    id: string;
    studentId: string;
    program: string;
    sessionYear: string;
    batch?: string | null;
    status: AccountStatus;
    supervisor?: {
      user: {
        name: string;
        email: string;
      };
    } | null;
    supervisorName?: string | null;
  } | null;
  facultyProfile?: {
    id: string;
    designation: string;
    department: string;
    officeRoom?: string | null;
  } | null;
  stats?: {
    totalHours: number;
    upcomingBookingsCount: number;
    totalLogsCount: number;
    supervisedStudentsCount: number;
    pendingVerificationsCount: number;
  };
  onCloseMobile?: () => void;
}

export function PortalSidebar({
  user,
  studentProfile,
  facultyProfile,
  stats,
  onCloseMobile,
}: PortalSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await logoutAction();
    window.location.href = "/login";
  };

  const isFaculty = user.role === Role.FACULTY;
  const isAdmin = user.role === Role.SUPER_ADMIN || user.role === Role.EDITOR;
  const isStudent = !isFaculty && !isAdmin;

  const isPending = studentProfile?.status === AccountStatus.PENDING_APPROVAL;
  const isSuspended = studentProfile?.status === AccountStatus.SUSPENDED;

  // Role-specific navigation items
  const navItems = React.useMemo(() => {
    if (isFaculty) {
      return [
        {
          href: "/faculty",
          label: "Supervisor Dashboard",
          icon: LayoutDashboard,
          exact: true,
          badge: stats?.pendingVerificationsCount ? `${stats.pendingVerificationsCount} Pending` : undefined,
          badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        },
        {
          href: "/faculty/students",
          label: "Supervised Scholars",
          icon: GraduationCap,
          badge: stats?.supervisedStudentsCount ? `${stats.supervisedStudentsCount}` : undefined,
        },
        {
          href: "/faculty/activity",
          label: "Verify & Sign Logs",
          icon: CheckSquare,
        },
        {
          href: "/portal/book",
          label: "Reserve Instruments",
          icon: Microscope,
        },
        {
          href: "/portal",
          label: "Scholar Portal View",
          icon: UserCheck,
        },
      ];
    }

    if (isAdmin) {
      return [
        {
          href: "/portal",
          label: "Scholar Dashboard",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          href: "/portal/book",
          label: "Book Equipment",
          icon: Microscope,
        },
        {
          href: "/portal/history",
          label: "Thesis Logbook",
          icon: BookOpen,
        },
        {
          href: "/portal/profile",
          label: "Scholar Profile",
          icon: User,
        },
        {
          href: "/portal/sops",
          label: "Safety & SOPs",
          icon: ShieldCheck,
        },
        {
          href: "/faculty",
          label: "Faculty Supervisor Suite",
          icon: GraduationCap,
        },
        {
          href: "/admin",
          label: "Admin Management Console",
          icon: ShieldAlert,
          badge: "Root",
          badgeColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
        },
      ];
    }

    // Default: Scholar (STUDENT)
    return [
      {
        href: "/portal",
        label: "Overview & Dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        href: "/portal/book",
        label: "Book Instrumentation",
        icon: Microscope,
        badge: isPending ? "Locked" : undefined,
        badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      },
      {
        href: "/portal/history",
        label: "Thesis Logbook & Hours",
        icon: BookOpen,
        badge: stats?.totalHours ? `${Math.round(stats.totalHours * 10) / 10}h` : undefined,
      },
      {
        href: "/portal/profile",
        label: "Scholar & Supervisor Profile",
        icon: User,
      },
      {
        href: "/portal/sops",
        label: "Lab Safety Rules & SOPs",
        icon: ShieldCheck,
      },
    ];
  }, [isFaculty, isAdmin, isPending, stats]);

  const initials = user.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <aside className="w-64 xl:w-72 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between shrink-0 h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* User Identity Profile Card */}
        <div className="p-3.5 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]/60 shadow-2xs space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-md bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)] block truncate leading-tight">
                {user.name || "Lab Researcher"}
              </span>
              <span className="text-[11px] text-[var(--text-muted)] truncate block mt-0.5">
                {user.email}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--border)] flex flex-wrap items-center gap-1.5">
            {isFaculty && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                {facultyProfile?.designation || "FACULTY SUPERVISOR"}
              </span>
            )}
            {isAdmin && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                SYSTEM ADMIN
              </span>
            )}
            {isStudent && (
              <>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {studentProfile?.program ? studentProfile.program.replace("_", " ") : "SCHOLAR"}
                </span>

                {isPending && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>Pending Approval</span>
                  </span>
                )}
                {!isPending && !isSuspended && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Active Clearance</span>
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Primary Role Navigation */}
        <div className="space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
            <span>
              {isFaculty ? "Faculty Supervision" : isAdmin ? "System Navigation" : "Scholar Workspace"}
            </span>
            <span className="text-[9px] text-[var(--text-muted)]">JU BTIB</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || (item.href !== "/portal" && pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  prefetch={false}
                  onMouseEnter={() => router.prefetch(item.href)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all group",
                    isActive
                      ? "bg-[var(--surface-raised)] text-[var(--brand-primary)] font-semibold border border-[var(--brand-primary)]/30 shadow-xs"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive ? "text-[var(--brand-primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        "px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold border shrink-0",
                        item.badgeColor || "bg-[var(--surface-raised)] text-[var(--text-muted)] border-[var(--border)]"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Role Telemetry Widget in Sidebar */}
        {isStudent && (
          <div className="p-3.5 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]/40 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[var(--bio-teal)]" />
                <span>Lab Hours</span>
              </span>
              <span className="font-bold text-[var(--text-primary)] font-sans">
                {Math.round((stats?.totalHours || 0) * 10) / 10} hrs
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-emerald-500" />
                <span>Upcoming</span>
              </span>
              <span className="font-bold text-[var(--text-primary)] font-sans">
                {stats?.upcomingBookingsCount || 0} slots
              </span>
            </div>

            {studentProfile?.supervisor && (
              <div className="pt-2 border-t border-[var(--border)] text-[11px] space-y-0.5">
                <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">
                  Supervisor:
                </span>
                <span className="font-medium text-[var(--text-primary)] block truncate">
                  {studentProfile.supervisor.user.name}
                </span>
              </div>
            )}

            {!isPending && !isSuspended && (
              <Link
                href="/portal/book"
                onClick={onCloseMobile}
                className="w-full mt-1 py-1.5 rounded-md bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <PlusCircle className="w-3 h-3" />
                <span>Reserve Equipment</span>
              </Link>
            )}
          </div>
        )}

        {isFaculty && (
          <div className="p-3.5 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]/40 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span>Supervised Scholars:</span>
              <span className="font-bold text-[var(--text-primary)]">
                {stats?.supervisedStudentsCount || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span>Pending Sign-offs:</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {stats?.pendingVerificationsCount || 0}
              </span>
            </div>
            <Link
              href="/faculty/activity"
              onClick={onCloseMobile}
              className="w-full mt-1 py-1.5 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <CheckSquare className="w-3 h-3" />
              <span>Verify Log Submissions</span>
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Area */}
      <div className="p-4 border-t border-[var(--border)] space-y-2 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span>Return to Public Site</span>
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>

        <div className="pt-2 border-t border-[var(--border)]/60 flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] px-1">
          <span>BTIB Lab · JU</span>
          <span>v2.4 Secure</span>
        </div>
      </div>
    </aside>
  );
}
