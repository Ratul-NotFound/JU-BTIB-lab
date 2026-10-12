"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FlaskConical,
  FolderGit2,
  BookOpen,
  Users,
  Calendar,
  Images,
  FolderArchive,
  FileText,
  Inbox,
  Settings,
  ShieldAlert,
  LogOut,
  Sliders,
  GraduationCap,
  UserCheck,
  Clock,
  Bell,
  Sparkles,
} from "lucide-react";
import { logoutAction } from "@/server/actions/auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/notices", label: "Notices & Announcements", icon: Bell },
  { href: "/admin/faculty", label: "Faculty Supervisors", icon: GraduationCap },
  { href: "/admin/students", label: "Student Scholars", icon: UserCheck },
  { href: "/admin/bookings", label: "Equipment Bookings", icon: Clock },
  { href: "/admin/equipment", label: "Equipment & Instruments", icon: Sliders },
  { href: "/admin/research-areas", label: "Research Areas", icon: FlaskConical },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { href: "/admin/publications", label: "Publications", icon: BookOpen },
  { href: "/admin/team", label: "Public Team Roster", icon: Users },
  { href: "/admin/activities", label: "Activities", icon: Calendar },
  { href: "/admin/gallery", label: "Photo Gallery", icon: Images },
  { href: "/admin/blog", label: "News & Blog", icon: FileText },
  { href: "/admin/media", label: "Media Library", icon: FolderArchive },
  { href: "/admin/inbox", label: "Contact Inbox", icon: Inbox },
  { href: "/admin/settings?tab=landing", label: "Landing Page Sections", icon: Sparkles },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: ShieldAlert },
];

interface AdminSidebarProps {
  onCloseMobile?: () => void;
  isMobileDrawer?: boolean;
  className?: string;
}

export function AdminSidebar({
  onCloseMobile,
  isMobileDrawer = false,
  className,
}: AdminSidebarProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentTab, setCurrentTab] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setCurrentTab(params.get("tab"));
    }
  }, [pathname]);

  if (pathname === "/admin/login") {
    return null;
  }

  const handleSignOut = async () => {
    await logoutAction();
    window.location.href = "/admin/login";
  };

  return (
    <aside
      className={cn(
        isMobileDrawer
          ? "w-full h-full flex flex-col justify-between bg-[var(--surface)]"
          : "fixed top-14 bottom-0 left-0 w-64 border-r border-[var(--border)] bg-[var(--surface)] z-30 flex flex-col justify-between shrink-0",
        className
      )}
    >
      {/* Scrollable Navigation Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
          Repository Entities
        </div>
        <nav className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isLandingSectionsItem = item.href === "/admin/settings?tab=landing";
            const isSiteSettingsItem = item.href === "/admin/settings";

            let isActive = false;
            if (isLandingSectionsItem) {
              isActive = pathname === "/admin/settings" && currentTab === "landing";
            } else if (isSiteSettingsItem) {
              isActive = pathname === "/admin/settings" && currentTab !== "landing";
            } else if (item.href === "/admin") {
              isActive = pathname === "/admin";
            } else {
              isActive = pathname.startsWith(item.href);
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                onClick={onCloseMobile}
                onMouseEnter={() => router.prefetch(item.href)}
                onTouchStart={() => router.prefetch(item.href)}
                onFocus={() => router.prefetch(item.href)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors",
                  isActive
                    ? "bg-[var(--surface-raised)] text-[var(--bio-teal)] font-semibold border border-[var(--border)] shadow-2xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Permanently Pinned Footer */}
      <div className="shrink-0 p-4 border-t border-[var(--border)] bg-[var(--surface)] space-y-3">
        <div className="flex items-center gap-2.5 px-1 py-1">
          <div className="relative w-7 h-7 shrink-0">
            <Image
              src="/images/btib-logo.png"
              alt="BTIB"
              width={28}
              height={28}
              className="w-full h-full object-contain theme-invert-dark"
            />
          </div>
          <div className="text-[11px] leading-tight">
            <div className="font-bold text-[var(--text-primary)]">BTIB Laboratory</div>
            <div className="text-[10px] text-[var(--text-muted)]">Jahangirnagar Univ.</div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs text-[var(--danger)] hover:bg-[var(--danger-surface)] transition-colors text-left"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
