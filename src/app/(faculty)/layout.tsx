import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { FacultyNavClient } from "./faculty-nav-client";

export default async function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Ensure only Faculty and Super Admin can enter
  if (session.user.role !== Role.FACULTY && session.user.role !== Role.SUPER_ADMIN) {
    redirect("/portal");
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col font-sans">
      {/* Faculty Top Navigation */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-8 h-16 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1.5 rounded-md hover:bg-[var(--surface-raised)] transition-colors"
            title="Return to Public Site"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-px h-5 bg-[var(--border)]" />
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
              <Image
                src="/images/btib-logo.png"
                alt="BTIB Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain theme-invert-dark"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-[var(--text-primary)]">
                  BTIB Lab
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  FACULTY PORTAL
                </span>
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] hidden sm:block">
                Academic & Experimental Supervision
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 pr-2 border-r border-[var(--border)] text-xs text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">
              {session.user.name}
            </span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)]">
              {session.user.role === Role.SUPER_ADMIN ? "SUPER ADMIN" : "FACULTY"}
            </span>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Navigation Bar */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm px-4 sm:px-8 py-2 sticky top-16 z-30">
        <FacultyNavClient />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
