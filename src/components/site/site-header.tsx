"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
  { href: "/projects", label: "Projects" },
  { href: "/publications", label: "Publications" },
  { href: "/team", label: "Team" },
  { href: "/activities", label: "Activities" },
  { href: "/blog", label: "Blogs" },
  { href: "/gallery", label: "Gallery" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-14 sm:h-18 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand / Institutional Identity Lockup */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0 focus:outline-none">
          <div className="relative w-8 h-8 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image
              src="/images/btib-logo.png"
              alt="BTIB Laboratory Logo"
              width={44}
              height={44}
              priority
              className="theme-logo-light w-full h-full object-contain"
            />
            <Image
              src="/images/btib-logo-white.png"
              alt="BTIB Laboratory Logo"
              width={44}
              height={44}
              priority
              className="theme-logo-dark w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-extrabold text-sm sm:text-lg tracking-tight text-[var(--text-primary)] leading-tight group-hover:text-[var(--brand-primary)] transition-colors">
              BTIB Laboratory
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="relative w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 opacity-80">
                <Image
                  src="/images/ju-logo.png"
                  alt="JU"
                  width={14}
                  height={14}
                  className="theme-logo-light w-full h-full object-contain"
                />
                <Image
                  src="/images/ju-logo-white.png"
                  alt="JU"
                  width={14}
                  height={14}
                  className="theme-logo-dark w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] sm:text-[11px] font-sans text-[var(--text-muted)] font-medium tracking-tight">
                Jahangirnagar University
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Bar (Visible on >= 1024px screens) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "text-[var(--brand-primary)] bg-[var(--surface-raised)] border border-[var(--brand-primary)]/30 font-semibold shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]/70"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls: Theme Toggle & Contact Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle />

          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shadow-[0_3px_12px_rgba(0,146,184,0.35)] transition-all active:scale-[0.98]"
          >
            Contact Lab
          </Link>

          {/* Mobile / Tablet Menu Button (< 1024px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] focus:outline-none transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer (Space-Optimized 2-Column Grid) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="grid grid-cols-2 gap-1.5">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                pathname === "/"
                  ? "text-[var(--brand-primary)] bg-[var(--surface-raised)] border border-[var(--brand-primary)]/30"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
              }`}
            >
              Home
            </Link>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                    isActive
                      ? "text-[var(--brand-primary)] bg-[var(--surface-raised)] border border-[var(--brand-primary)]/30"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className={`col-span-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-center ${
                pathname === "/contact"
                  ? "text-[var(--brand-primary)] bg-[var(--surface-raised)] border border-[var(--brand-primary)]/30"
                  : "bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)]"
              }`}
            >
              Contact Laboratory
            </Link>
          </nav>

          <div className="pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
            <span>JU Campus, Savar</span>
            <Link href="/admin" className="text-[var(--brand-primary)] hover:underline font-semibold">
              Admin Portal →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
