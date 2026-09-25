"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
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
  LogOut,
  Sliders,
} from "lucide-react";
import { logoutAction } from "@/server/actions/auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/research-areas", label: "Research Areas", icon: FlaskConical },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { href: "/admin/publications", label: "Publications", icon: BookOpen },
  { href: "/admin/team", label: "Team Roster", icon: Users },
  { href: "/admin/equipment", label: "Equipment", icon: Sliders },
  { href: "/admin/activities", label: "Activities", icon: Calendar },
  { href: "/admin/gallery", label: "Photo Gallery", icon: ImageIcon },
  { href: "/admin/blog", label: "News & Blog", icon: FileText },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/inbox", label: "Contact Inbox", icon: Inbox },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: ShieldAlert },
];

export function AdminSidebar() {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return null;
  }

  const handleSignOut = async () => {
    await logoutAction();
    window.location.href = "/admin/login";
  };

  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between shrink-0 min-h-[calc(100vh-3.5rem)]">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
          Repository Entities
        </div>
        <nav className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors",
                  isActive
                    ? "bg-[var(--surface-raised)] text-[var(--bio-teal)] font-semibold border border-[var(--border)]"
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

      <div className="p-4 border-t border-[var(--border)] space-y-3">
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
