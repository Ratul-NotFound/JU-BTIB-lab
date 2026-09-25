import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowLeft } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Admin Top Navigation */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded hover:bg-[var(--surface-raised)]"
            title="Return to Public Site"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-px h-4 bg-[var(--border)]" />
          <div className="flex items-center gap-2.5">
            <div className="relative w-6 h-6 shrink-0 flex items-center justify-center">
              <Image
                src="/images/btib-logo.png"
                alt="BTIB Logo"
                width={24}
                height={24}
                className="w-full h-full object-contain theme-invert-dark"
              />
            </div>
            <span className="font-bold text-sm tracking-tight text-[var(--text-primary)]">
              BTIB Console
            </span>
            <span className="specimen-tag text-[10px] py-0 px-1.5 font-bold">ADMIN</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="w-px h-4 bg-[var(--border)]" />
          <span className="text-xs font-mono text-[var(--text-muted)] hidden sm:inline">
            SECURE REPOSITORY
          </span>
        </div>
      </header>

      {/* Admin content body */}
      <div className="flex-1 flex overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
