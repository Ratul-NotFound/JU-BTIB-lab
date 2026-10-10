"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileCheck2, Users, Microscope, LogOut, Bell } from "lucide-react";
import { logoutAction } from "@/server/actions/auth";
import { cn } from "@/lib/utils";

const NAV_TABS = [
  { href: "/faculty", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/notices", label: "Notices & Bulletins", icon: Bell },
  { href: "/faculty/activity", label: "Activity Tracer & Sign-off", icon: FileCheck2 },
  { href: "/faculty/students", label: "Supervised Scholars", icon: Users },
  { href: "/portal/book", label: "Book Equipment", icon: Microscope },
];

export function FacultyNavClient() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await logoutAction();
    window.location.href = "/login";
  };

  return (
    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto">
      <nav className="flex items-center gap-1 sm:gap-2">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.href === "/faculty"
              ? pathname === "/faculty"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all shrink-0",
                isActive
                  ? "bg-purple-600 text-white font-semibold shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleSignOut}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-red-600 hover:bg-red-500/10 transition-colors shrink-0"
        title="Sign Out"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Sign Out</span>
      </button>
    </div>
  );
}
