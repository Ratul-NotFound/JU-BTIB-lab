"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  ChevronDown,
  FlaskConical,
  FolderGit2,
  BookOpen,
  Users,
  Sliders,
  FileText,
  Sparkles,
  Calendar,
  Images,
  ArrowRight,
} from "lucide-react";

interface SubItem {
  href: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  id: string;
  label: string;
  items: SubItem[];
}

const RESEARCH_GROUP: NavGroup = {
  id: "research",
  label: "Research",
  items: [
    {
      href: "/research",
      label: "Research Areas",
      description: "Microbial biotech, bioprocessing & kinetics",
      icon: FlaskConical,
    },
    {
      href: "/projects",
      label: "Projects & Grants",
      description: "Active research initiatives & funded grants",
      icon: FolderGit2,
    },
    {
      href: "/publications",
      label: "Publications",
      description: "Peer-reviewed papers, journals & patents",
      icon: BookOpen,
    },
  ],
};

const ABOUT_GROUP: NavGroup = {
  id: "about",
  label: "About",
  items: [
    {
      href: "/about",
      label: "About BTIB Lab",
      description: "Mission, vision, facilities & JU history",
      icon: Sparkles,
    },
    {
      href: "/activities",
      label: "Activities & Seminars",
      description: "Academic symposiums, seminars & outreach",
      icon: Calendar,
    },
    {
      href: "/gallery",
      label: "Photo Gallery",
      description: "Visual archive of lab experiments & events",
      icon: Images,
    },
  ],
};

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close mobile drawer and dropdown on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Click outside to close dropdowns
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 180);
  };

  const isResearchActive =
    pathname === "/research" ||
    pathname.startsWith("/research/") ||
    pathname === "/projects" ||
    pathname.startsWith("/projects/") ||
    pathname === "/publications" ||
    pathname.startsWith("/publications/");

  const isAboutActive =
    pathname === "/about" ||
    pathname.startsWith("/about/") ||
    pathname === "/activities" ||
    pathname.startsWith("/activities/") ||
    pathname === "/gallery" ||
    pathname.startsWith("/gallery/");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3 sm:gap-6">
        {/* 1. Brand / Institutional Identity Lockup */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 focus:outline-none">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image
              src="/images/btib-logo.png"
              alt="BTIB Laboratory Logo"
              width={40}
              height={40}
              priority
              className="theme-logo-light w-full h-full object-contain"
            />
            <Image
              src="/images/btib-logo-white.png"
              alt="BTIB Laboratory Logo"
              width={40}
              height={40}
              priority
              className="theme-logo-dark w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-[var(--text-primary)] leading-tight group-hover:text-[var(--brand-primary)] transition-colors whitespace-nowrap">
              BTIB Laboratory
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="relative w-3 h-3 shrink-0 opacity-80">
                <Image
                  src="/images/ju-logo.png"
                  alt="JU"
                  width={12}
                  height={12}
                  className="theme-logo-light w-full h-full object-contain"
                />
                <Image
                  src="/images/ju-logo-white.png"
                  alt="JU"
                  width={12}
                  height={12}
                  className="theme-logo-dark w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] font-sans text-[var(--text-muted)] font-medium tracking-tight whitespace-nowrap">
                Jahangirnagar University
              </span>
            </div>
          </div>
        </Link>

        {/* 2. Streamlined Desktop Navigation (Grouped Dropdowns + Direct Links) */}
        <nav ref={containerRef} className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* About Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("about")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "about" ? null : "about")}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-md text-xs xl:text-sm font-medium transition-all whitespace-nowrap focus:outline-none",
                isAboutActive
                  ? "text-[var(--brand-primary)] bg-[var(--surface-raised)] border border-[var(--brand-primary)]/30 font-semibold shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]/70",
                openDropdown === "about" && "bg-[var(--surface-raised)] text-[var(--text-primary)]"
              )}
            >
              <span>About</span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200 opacity-60",
                  openDropdown === "about" && "rotate-180 opacity-100 text-[var(--brand-primary)]"
                )}
              />
            </button>

            {openDropdown === "about" && (
              <div className="absolute top-full left-0 mt-1.5 w-72 rounded-md border border-[var(--border)] bg-[var(--surface)]/98 backdrop-blur-xl shadow-xl p-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="p-1.5 border-b border-[var(--border)] mb-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                    Laboratory Overview
                  </div>
                </div>
                <div className="space-y-0.5">
                  {ABOUT_GROUP.items.map((sub) => {
                    const isSubActive = pathname === sub.href || pathname.startsWith(`${sub.href}/`);
                    const Icon = sub.icon;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setOpenDropdown(null)}
                        className={cn(
                          "flex items-start gap-2.5 p-2 rounded-md transition-colors group/item",
                          isSubActive
                            ? "bg-[var(--surface-raised)] text-[var(--brand-primary)]"
                            : "hover:bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        )}
                      >
                        <div
                          className={cn(
                            "p-1.5 rounded-md shrink-0 transition-colors mt-0.5",
                            isSubActive
                              ? "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]"
                              : "bg-[var(--surface-raised)] text-[var(--text-muted)] group-hover/item:text-[var(--brand-primary)] group-hover/item:bg-[var(--brand-primary)]/10"
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div
                            className={cn(
                              "text-xs font-semibold tracking-tight transition-colors",
                              isSubActive
                                ? "text-[var(--brand-primary)]"
                                : "text-[var(--text-primary)] group-hover/item:text-[var(--brand-primary)]"
                            )}
                          >
                            {sub.label}
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 leading-snug">
                            {sub.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Research Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("research")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "research" ? null : "research")}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-md text-xs xl:text-sm font-medium transition-all whitespace-nowrap focus:outline-none",
                isResearchActive
                  ? "text-[var(--brand-primary)] bg-[var(--surface-raised)] border border-[var(--brand-primary)]/30 font-semibold shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]/70",
                openDropdown === "research" && "bg-[var(--surface-raised)] text-[var(--text-primary)]"
              )}
            >
              <span>Research</span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200 opacity-60",
                  openDropdown === "research" && "rotate-180 opacity-100 text-[var(--brand-primary)]"
                )}
              />
            </button>

            {openDropdown === "research" && (
              <div className="absolute top-full left-0 mt-1.5 w-76 rounded-md border border-[var(--border)] bg-[var(--surface)]/98 backdrop-blur-xl shadow-xl p-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="p-1.5 border-b border-[var(--border)] mb-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                    Research & Scientific Output
                  </div>
                </div>
                <div className="space-y-0.5">
                  {RESEARCH_GROUP.items.map((sub) => {
                    const isSubActive = pathname === sub.href || pathname.startsWith(`${sub.href}/`);
                    const Icon = sub.icon;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setOpenDropdown(null)}
                        className={cn(
                          "flex items-start gap-2.5 p-2 rounded-md transition-colors group/item",
                          isSubActive
                            ? "bg-[var(--surface-raised)] text-[var(--brand-primary)]"
                            : "hover:bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        )}
                      >
                        <div
                          className={cn(
                            "p-1.5 rounded-md shrink-0 transition-colors mt-0.5",
                            isSubActive
                              ? "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]"
                              : "bg-[var(--surface-raised)] text-[var(--text-muted)] group-hover/item:text-[var(--brand-primary)] group-hover/item:bg-[var(--brand-primary)]/10"
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div
                            className={cn(
                              "text-xs font-semibold tracking-tight transition-colors",
                              isSubActive
                                ? "text-[var(--brand-primary)]"
                                : "text-[var(--text-primary)] group-hover/item:text-[var(--brand-primary)]"
                            )}
                          >
                            {sub.label}
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 leading-snug">
                            {sub.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Direct Link: Equipment (Clean label + whitespace-nowrap) */}
          <Link
            href="/equipment"
            className={cn(
              "px-3 py-1.5 rounded-md text-xs xl:text-sm font-medium transition-all whitespace-nowrap",
              pathname === "/equipment" || pathname.startsWith("/equipment/")
                ? "text-[var(--brand-primary)] bg-[var(--surface-raised)] border border-[var(--brand-primary)]/30 font-semibold shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]/70"
            )}
          >
            Equipment
          </Link>

          {/* Direct Link: Team */}
          <Link
            href="/team"
            className={cn(
              "px-3 py-1.5 rounded-md text-xs xl:text-sm font-medium transition-all whitespace-nowrap",
              pathname === "/team" || pathname.startsWith("/team/")
                ? "text-[var(--brand-primary)] bg-[var(--surface-raised)] border border-[var(--brand-primary)]/30 font-semibold shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]/70"
            )}
          >
            Team
          </Link>

          {/* Direct Link: News */}
          <Link
            href="/blog"
            className={cn(
              "px-3 py-1.5 rounded-md text-xs xl:text-sm font-medium transition-all whitespace-nowrap",
              pathname === "/blog" || pathname.startsWith("/blog/")
                ? "text-[var(--brand-primary)] bg-[var(--surface-raised)] border border-[var(--brand-primary)]/30 font-semibold shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]/70"
            )}
          >
            News
          </Link>
        </nav>

        {/* 3. Action Controls: Theme Toggle & Direct Portals */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <ThemeToggle />

          <Link
            href="/portal"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-md text-xs font-semibold bg-[var(--surface-raised)] hover:bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] transition-all shadow-xs hover:border-[var(--brand-primary)]/40 whitespace-nowrap"
            title="Lab Scholar & Faculty Portal"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="whitespace-nowrap">Portal</span>
          </Link>

          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center px-3.5 py-1.5 sm:py-2 rounded-md text-xs font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shadow-sm hover:shadow transition-all active:scale-[0.98] whitespace-nowrap"
          >
            Contact Lab
          </Link>

          {/* Mobile / Tablet Menu Button (< 1024px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-md border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] focus:outline-none transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* 4. Responsive Mobile Drawer (< 1024px) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[calc(100vh-4.5rem)] overflow-y-auto">
          {/* Section: Research & Output */}
          <div className="space-y-1.5">
            <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
              Research & Output
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {RESEARCH_GROUP.items.map((sub) => {
                const isActive = pathname === sub.href || pathname.startsWith(`${sub.href}/`);
                const Icon = sub.icon;
                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors",
                      isActive
                        ? "text-[var(--brand-primary)] bg-[var(--surface-raised)] border border-[var(--brand-primary)]/30 font-semibold"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="truncate">{sub.label}</span>
                  </Link>
                );
              })}
              <Link
                href="/equipment"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors",
                  pathname === "/equipment" || pathname.startsWith("/equipment/")
                    ? "text-[var(--brand-primary)] bg-[var(--surface-raised)] border border-[var(--brand-primary)]/30 font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
                )}
              >
                <Sliders className="w-3.5 h-3.5 shrink-0 opacity-70" />
                <span className="truncate">Equipment</span>
              </Link>
            </div>
          </div>

          {/* Section: About & Community */}
          <div className="space-y-1.5">
            <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
              About & Community
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {ABOUT_GROUP.items.map((sub) => {
                const isActive = pathname === sub.href || pathname.startsWith(`${sub.href}/`);
                const Icon = sub.icon;
                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors",
                      isActive
                        ? "text-[var(--brand-primary)] bg-[var(--surface-raised)] border border-[var(--brand-primary)]/30 font-semibold"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="truncate">{sub.label}</span>
                  </Link>
                );
              })}
              <Link
                href="/team"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors",
                  pathname === "/team" || pathname.startsWith("/team/")
                    ? "text-[var(--brand-primary)] bg-[var(--surface-raised)] border border-[var(--brand-primary)]/30 font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
                )}
              >
                <Users className="w-3.5 h-3.5 shrink-0 opacity-70" />
                <span className="truncate">Team</span>
              </Link>
              <Link
                href="/blog"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors",
                  pathname === "/blog" || pathname.startsWith("/blog/")
                    ? "text-[var(--brand-primary)] bg-[var(--surface-raised)] border border-[var(--brand-primary)]/30 font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
                )}
              >
                <FileText className="w-3.5 h-3.5 shrink-0 opacity-70" />
                <span className="truncate">News & Blog</span>
              </Link>
            </div>
          </div>

          {/* Section: Direct Portals */}
          <div className="pt-2 border-t border-[var(--border)] space-y-2">
            <Link
              href="/portal"
              className="w-full px-3.5 py-2.5 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Lab Scholar & Faculty Portal</span>
            </Link>

            <Link
              href="/contact"
              className="w-full px-3.5 py-2.5 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] shadow-xs"
            >
              <span>Contact Laboratory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
            <span>JU Campus, Savar</span>
            <Link href="/admin" className="text-[var(--brand-primary)] hover:underline font-semibold">
              Admin Console →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
