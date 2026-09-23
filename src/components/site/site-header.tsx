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
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-18 flex items-center justify-between gap-4">
        {/* Brand / Institutional Identity Lockup */}
        <Link href="/" className="flex items-center gap-3.5 group shrink-0 focus:outline-none">
          <div className="relative w-11 h-11 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
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
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-[var(--text-primary)] leading-tight group-hover:text-[var(--brand-primary)] transition-colors">
              BTIB Laboratory
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="relative w-3.5 h-3.5 shrink-0 opacity-80">
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
              <span className="text-[11px] font-sans text-[var(--text-muted)] font-medium tracking-tight">
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
        <div className="flex items-center gap-3 shrink-0">
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
            className="lg:hidden p-2 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] focus:outline-none transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--surface)] px-6 py-5 space-y-4">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "text-[var(--brand-primary)] bg-[var(--surface-raised)] font-semibold border border-[var(--brand-primary)]/30"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
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
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[var(--brand-primary)] bg-[var(--surface-raised)] font-semibold border border-[var(--brand-primary)]/30"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === "/contact"
                  ? "text-[var(--brand-primary)] bg-[var(--surface-raised)] font-semibold border border-[var(--brand-primary)]/30"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Contact Lab
            </Link>
          </nav>

          <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <span>Savar, Dhaka-1342, Bangladesh</span>
            <Link href="/admin" className="text-[var(--brand-primary)] hover:underline">
              Admin Console →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
