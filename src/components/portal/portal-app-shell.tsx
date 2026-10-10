"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
  Award,
  LogOut,
} from "lucide-react";
import { Role } from "@prisma/client";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PortalSidebar, PortalSidebarProps } from "./portal-sidebar";
import { logoutAction } from "@/server/actions/auth";

export interface PortalAppShellProps extends PortalSidebarProps {
  children: React.ReactNode;
}

export function PortalAppShell({
  children,
  user,
  studentProfile,
  facultyProfile,
  stats,
}: PortalAppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await logoutAction();
    window.location.href = "/login";
  };

  const isFaculty = user.role === Role.FACULTY;
  const isAdmin = user.role === Role.SUPER_ADMIN || user.role === Role.EDITOR;

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col font-sans">
      {/* 1. Top Portal Application Bar */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Sidebar Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-md border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
            aria-label="Toggle Portal Sidebar"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Quick Return to Public Site */}
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors border border-[var(--border)]/60"
            title="Return to Public Laboratory Website"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </Link>

          <div className="hidden sm:block w-px h-5 bg-[var(--border)]" />

          {/* Institutional Brand */}
          <Link href="/portal" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
              <Image
                src="/images/btib-logo.png"
                alt="BTIB Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain theme-invert-dark transition-transform group-hover:scale-105"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors leading-none">
                  BTIB Laboratory
                </span>
                {pathname.startsWith("/faculty") ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>FACULTY SUPERVISOR SUITE</span>
                  </span>
                ) : isFaculty ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>FACULTY PORTAL</span>
                  </span>
                ) : isAdmin ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>ADMIN PORTAL</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    <span>SCHOLAR PORTAL</span>
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono hidden md:block mt-0.5">
                Jahangirnagar University · Dept. of BGE
              </span>
            </div>
          </Link>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeToggle />

          <div className="w-px h-5 bg-[var(--border)]" />

          {/* User Name & Quick Sign Out */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[var(--text-secondary)] hidden md:inline truncate max-w-[140px]">
              {user.name}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-red-600 hover:bg-red-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Portal Workspace Body with Persistent Desktop Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Sidebar (Persistent on lg screens) */}
        <div className="hidden lg:block shrink-0">
          <PortalSidebar
            user={user}
            studentProfile={studentProfile}
            facultyProfile={facultyProfile}
            stats={stats}
          />
        </div>

        {/* Mobile Slide-Over Drawer with Backdrop */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Content */}
            <div className="relative w-72 max-w-[85vw] bg-[var(--surface)] h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
              <div className="p-3.5 border-b border-[var(--border)] flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  Portal Navigation
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <PortalSidebar
                  user={user}
                  studentProfile={studentProfile}
                  facultyProfile={facultyProfile}
                  stats={stats}
                  onCloseMobile={() => setMobileMenuOpen(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-[var(--background)]">
          {children}
        </main>
      </div>
    </div>
  );
}
