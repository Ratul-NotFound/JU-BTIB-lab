"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ActivityType } from "@prisma/client";
import {
  ArrowRight,
  Award,
  Calendar,
  Camera,
  Globe,
  LayoutGrid,
  LayoutList,
  MapPin,
  Search,
  Sparkles,
  Wrench,
  X,
  Layers,
} from "lucide-react";

export interface ActivityItem {
  id: string;
  slug: string;
  type: ActivityType;
  title: string;
  date: Date;
  location: string | null;
  bodyHtml: string | null;
  coverImage: string | null;
  albums: Array<{
    id: string;
    title: string;
    images: Array<{ id: string; url: string; alt: string }>;
  }>;
}

const TYPE_CONFIG: Record<
  ActivityType,
  { label: string; bg: string; text: string; border: string; icon: React.ElementType }
> = {
  ACHIEVEMENT: {
    label: "Achievement & Award",
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/30",
    icon: Award,
  },
  CONFERENCE: {
    label: "Conference & Symposium",
    bg: "bg-sky-500/10",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-500/30",
    icon: Globe,
  },
  VISIT: {
    label: "Field Expedition & Works",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
    icon: MapPin,
  },
  WORKSHOP: {
    label: "Workshop & Practical",
    bg: "bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/30",
    icon: Wrench,
  },
  TRAINING: {
    label: "Training & Masterclass",
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
    icon: Sparkles,
  },
  SEMINAR: {
    label: "Seminar & Lecture",
    bg: "bg-slate-500/10",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-500/30",
    icon: Globe,
  },
};

const TYPE_DEFAULT_IMAGES: Record<ActivityType, string> = {
  ACHIEVEMENT: "/images/liquid-tree.jpg",
  CONFERENCE: "/images/facilities/cleanroom-pilot.jpg",
  VISIT: "/images/hero-lab.jpg",
  WORKSHOP: "/images/fermentation.jpg",
  TRAINING: "/images/facilities/hplc.jpg",
  SEMINAR: "/images/domains/bioprocess-eng.jpg",
};

export function ActivitiesListClient({ activities }: { activities: ActivityItem[] }) {
  const [selectedType, setSelectedType] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");

  // Filter activities dynamically based on category tab & search query
  const filtered = React.useMemo(() => {
    return activities.filter((act) => {
      // Category filter
      if (selectedType !== "ALL" && act.type !== selectedType) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = act.title.toLowerCase().includes(query);
        const locMatch = act.location?.toLowerCase().includes(query);
        const bodyMatch = act.bodyHtml?.toLowerCase().includes(query);
        return titleMatch || locMatch || bodyMatch;
      }
      return true;
    });
  }, [activities, selectedType, searchQuery]);

  // Available categories that have at least 1 item
  const categoriesWithItems = React.useMemo(() => {
    const presentTypes = new Set(activities.map((a) => a.type));
    return (Object.keys(TYPE_CONFIG) as ActivityType[]).filter((t) => presentTypes.has(t));
  }, [activities]);

  const counts: Record<string, number> = React.useMemo(() => {
    const map: Record<string, number> = { ALL: activities.length };
    for (const act of activities) {
      map[act.type] = (map[act.type] || 0) + 1;
    }
    return map;
  }, [activities]);

  return (
    <div className="space-y-6">
      {/* Controls & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedType("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedType === "ALL"
                ? "bg-[var(--brand-primary)] text-white shadow-xs"
                : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
            }`}
          >
            <span>All</span>
            <span className="ml-1 opacity-70">({counts.ALL || 0})</span>
          </button>

          {categoriesWithItems.map((type) => {
            const isActive = selectedType === type;
            const config = TYPE_CONFIG[type];
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[var(--brand-primary)] text-white shadow-xs"
                    : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
                }`}
              >
                <span>{config.label.split("&")[0].trim()}</span>
                <span className="ml-1 opacity-70">({counts[type] || 0})</span>
              </button>
            );
          })}
        </div>

        {/* Search & View Switcher */}
        <div className="flex items-center gap-2">
          {/* Quick Search Input */}
          <div className="relative flex-1 sm:w-52">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full text-xs h-8 pl-8 pr-7 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Toggle: List / Grid */}
          <div className="flex items-center p-0.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "list"
                  ? "bg-[var(--brand-primary)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
              title="Compact Horizontal List"
              aria-label="Compact Horizontal List"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-[var(--brand-primary)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
              title="Compact 3-Column Grid"
              aria-label="Compact 3-Column Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* COMPACT LIST VIEW                                                 */}
      {/* ================================================================= */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {filtered.map((act) => {
            const config = TYPE_CONFIG[act.type] || TYPE_CONFIG.SEMINAR;
            const IconComponent = config.icon;
            const photoCount = act.albums.reduce((acc, alb) => acc + alb.images.length, 0);
            const imageSrc = act.coverImage || TYPE_DEFAULT_IMAGES[act.type] || "/images/hero-lab.jpg";

            const snippet = act.bodyHtml
              ? act.bodyHtml.replace(/<[^>]*>?/gm, "").slice(0, 160) + "..."
              : null;

            return (
              <Link
                key={act.id}
                href={`/activities/${act.slug}`}
                className="group relative flex flex-col sm:flex-row items-stretch rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)]/70 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Left Thumbnail (Desktop: compact 220px, Mobile: 16:9 ratio) */}
                <div className="relative w-full sm:w-52 md:w-56 h-36 sm:h-auto min-h-[130px] shrink-0 overflow-hidden bg-[var(--surface-raised)]">
                  <Image
                    src={imageSrc}
                    alt={act.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 240px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent sm:hidden" />

                  {/* Photo badge if albums exist */}
                  {photoCount > 0 && (
                    <div className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/75 backdrop-blur-md text-white border border-white/10">
                      <Camera className="w-3 h-3 text-[var(--brand-primary)]" />
                      <span>{photoCount}</span>
                    </div>
                  )}
                </div>

                {/* Right Content */}
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-2.5">
                  <div className="space-y-1.5">
                    {/* Meta Row: Type Badge + Date + Location */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${config.bg} ${config.text} border ${config.border}`}
                      >
                        <IconComponent className="w-3 h-3" />
                        <span>{config.label}</span>
                      </span>

                      <span className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] font-medium">
                        <Calendar className="w-3 h-3 text-[var(--brand-primary)]" />
                        <span>
                          {new Date(act.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </span>

                      {act.location && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)] font-medium truncate max-w-[220px]">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          <span className="truncate">{act.location}</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-bold font-sans text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors leading-snug line-clamp-2">
                      {act.title}
                    </h3>

                    {/* Snippet */}
                    {snippet && (
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-light line-clamp-2">
                        {snippet}
                      </p>
                    )}
                  </div>

                  {/* Footer with mobile location & action link */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-[var(--border)]/50 text-xs">
                    {act.location ? (
                      <span className="text-[11px] text-[var(--text-muted)] sm:hidden flex items-center gap-1 truncate max-w-[200px]">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span className="truncate">{act.location}</span>
                      </span>
                    ) : (
                      <span />
                    )}

                    <span className="inline-flex items-center gap-1 font-semibold text-[var(--brand-primary)] group-hover:translate-x-1 transition-transform ml-auto text-xs">
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ================================================================= */}
      {/* COMPACT GRID VIEW (3 Columns)                                     */}
      {/* ================================================================= */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((act) => {
            const config = TYPE_CONFIG[act.type] || TYPE_CONFIG.SEMINAR;
            const IconComponent = config.icon;
            const photoCount = act.albums.reduce((acc, alb) => acc + alb.images.length, 0);
            const imageSrc = act.coverImage || TYPE_DEFAULT_IMAGES[act.type] || "/images/hero-lab.jpg";

            const snippet = act.bodyHtml
              ? act.bodyHtml.replace(/<[^>]*>?/gm, "").slice(0, 120) + "..."
              : null;

            return (
              <Link
                key={act.id}
                href={`/activities/${act.slug}`}
                className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)]/70 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Shallow 16:9 Image */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-[var(--surface-raised)]">
                  <Image
                    src={imageSrc}
                    alt={act.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Badge top-left */}
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/65 backdrop-blur-md text-white border border-white/20`}
                    >
                      <IconComponent className="w-3 h-3 text-[var(--brand-primary)]" />
                      <span>{config.label.split("&")[0].trim()}</span>
                    </span>
                  </div>

                  {/* Photo count top-right */}
                  {photoCount > 0 && (
                    <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/75 backdrop-blur-md text-white border border-white/10">
                      <Camera className="w-3 h-3 text-[var(--brand-primary)]" />
                      <span>{photoCount}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] font-medium">
                      <Calendar className="w-3 h-3 text-[var(--brand-primary)]" />
                      <span>
                        {new Date(act.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {act.location && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[120px]">{act.location}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-sm font-bold font-sans text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2 leading-snug">
                      {act.title}
                    </h3>

                    {snippet && (
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed font-light">
                        {snippet}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[var(--border)]/50 flex items-center justify-between text-xs font-semibold text-[var(--brand-primary)]">
                    <span>Read Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="p-10 text-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-2.5">
          <Layers className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-40" />
          <h4 className="text-sm font-bold text-[var(--text-primary)]">No events match your criteria</h4>
          <p className="text-xs text-[var(--text-secondary)]">
            {searchQuery
              ? `No activities found matching "${searchQuery}".`
              : "No activities registered under this category."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedType("ALL");
              setSearchQuery("");
            }}
            className="mt-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
