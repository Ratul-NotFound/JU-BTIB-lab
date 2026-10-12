"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AdminTopProgress } from "@/components/admin/admin-top-progress";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

interface AdminAppShellProps {
  children: React.ReactNode;
}

export function AdminAppShell({ children }: AdminAppShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  // Automatically close mobile drawer when route changes
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Don't render shell on admin login page
  const isLoginPage = pathname === "/admin/login";
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <React.Suspense fallback={null}>
        <AdminTopProgress />
      </React.Suspense>

      {/* 1. Fixed Top Application Header */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Return to Public Site */}
          <Link
            href="/"
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1.5 rounded hover:bg-[var(--surface-raised)] transition-colors"
            title="Return to Public Site"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="w-px h-4 bg-[var(--border)]" />

          {/* Logo & Brand */}
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="relative w-6 h-6 shrink-0 flex items-center justify-center">
              <Image
                src="/images/btib-logo.png"
                alt="BTIB Logo"
                width={24}
                height={24}
                className="w-full h-full object-contain theme-invert-dark transition-transform group-hover:scale-105"
              />
            </div>
            <span className="font-bold text-sm tracking-tight text-[var(--text-primary)] group-hover:text-[var(--bio-teal)] transition-colors">
              BTIB Console
            </span>
            <span className="specimen-tag text-[10px] py-0 px-1.5 font-bold">ADMIN</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="w-px h-4 bg-[var(--border)]" />
          <span className="text-xs font-mono text-[var(--text-muted)] hidden sm:inline">
            SECURE REPOSITORY
          </span>
        </div>
      </header>

      {/* 2. Body Container with Fixed Desktop Sidebar and Independently Scrolling Main Content */}
      <div className="flex-1 flex w-full relative">
        {/* Desktop Fixed Sidebar (Permanently pinned on md+ screens) */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        {/* Mobile Slide-Over Drawer with Backdrop */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer Container */}
            <div className="relative w-72 max-w-[85vw] bg-[var(--surface)] h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
              <div className="p-3.5 border-b border-[var(--border)] flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  Console Navigation
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <AdminSidebar onCloseMobile={() => setMobileOpen(false)} isMobileDrawer />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area: Offset by 16rem (pl-64) on desktop so it sits right beside the fixed sidebar */}
        <main className="flex-1 min-w-0 w-full md:pl-64 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
