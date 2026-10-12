"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Compass,
  Target,
  FlaskConical,
  Layers,
  Microscope,
  Dna,
  Sprout,
  Atom,
  Sparkles,
  Award,
  Globe,
  Zap,
  Activity,
  Cpu,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem, InteractiveCard } from "@/components/ui/reveal";
import {
  type LandingPillarsSectionData,
  DEFAULT_LANDING_PILLARS,
} from "@/types/settings-sections";

const ICON_MAP: Record<string, LucideIcon> = {
  compass: Compass,
  target: Target,
  flask: FlaskConical,
  layers: Layers,
  microscope: Microscope,
  dna: Dna,
  sprout: Sprout,
  leaf: Sprout,
  atom: Atom,
  sparkles: Sparkles,
  award: Award,
  globe: Globe,
  zap: Zap,
  activity: Activity,
  cpu: Cpu,
  book: BookOpen,
};

function resolveIcon(iconKey?: string): LucideIcon {
  if (!iconKey) return Compass;
  const key = iconKey.toLowerCase().trim();
  return ICON_MAP[key] || Compass;
}

interface LabIntroSectionProps {
  data?: LandingPillarsSectionData | null;
}

export function LabIntroSection({ data }: LabIntroSectionProps) {
  const sectionData = data || DEFAULT_LANDING_PILLARS;
  const items = sectionData.items && sectionData.items.length > 0 ? sectionData.items : DEFAULT_LANDING_PILLARS.items;

  const sectionTitle = sectionData.sectionTitle || DEFAULT_LANDING_PILLARS.sectionTitle;
  const sectionSubtitle = sectionData.sectionSubtitle || DEFAULT_LANDING_PILLARS.sectionSubtitle;
  const sectionBadge = sectionData.sectionBadge || DEFAULT_LANDING_PILLARS.sectionBadge;
  const actionText = sectionData.actionText || DEFAULT_LANDING_PILLARS.actionText;
  const actionLink = sectionData.actionLink || DEFAULT_LANDING_PILLARS.actionLink;

  // Determine grid columns based on item count
  const gridColsClass =
    items.length === 3
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6"
      : items.length === 2
      ? "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto"
      : "grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-6";

  return (
    <section className="w-full bg-[var(--background)] py-8 sm:py-16 lg:py-20 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-5 sm:space-y-10">
        
        {/* Synchronized Section Header */}
        <Reveal direction="up" distance={18}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-6 pb-1 sm:pb-2">
            <div className="space-y-1.5 sm:space-y-3 max-w-3xl">
              {sectionBadge && (
                <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-wider text-[var(--brand-primary)] uppercase block">
                  {sectionBadge}
                </span>
              )}
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.14]">
                {sectionTitle}
              </h2>
              <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed font-light max-w-2xl">
                {sectionSubtitle}
              </p>
            </div>

            {actionLink && actionText && (
              <Link
                href={actionLink}
                className="text-xs sm:text-sm font-bold font-sans text-[var(--brand-primary)] hover:underline inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto group"
              >
                <span>{actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </Reveal>

        {/* Dynamic Tenet Pillar Cards */}
        <StaggerContainer
          staggerDelay={0.08}
          delayChildren={0.06}
          className={gridColsClass}
        >
          {items.map((pillar, idx) => {
            const Icon = resolveIcon(pillar.icon);
            const cardInner = (
              <>
                <div className="space-y-2 sm:space-y-3.5">
                  {/* Optional Picture Thumbnail Header */}
                  {pillar.image ? (
                    <div className="relative w-full h-32 sm:h-40 -mt-3 -mx-3 sm:-mt-6 sm:-mx-6 mb-2.5 sm:mb-4 overflow-hidden bg-slate-950/80">
                      <Image
                        src={pillar.image}
                        alt={pillar.imageAlt || pillar.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
                      {pillar.badge && (
                        <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-semibold uppercase bg-black/75 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                          {pillar.badge}
                        </span>
                      )}
                      <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 w-6 h-6 sm:w-8 sm:h-8 rounded bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20">
                        <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 sm:w-10 sm:h-10 rounded bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center transition-colors group-hover:bg-[var(--brand-primary)]/20">
                        <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                      </div>
                      {pillar.badge && (
                        <span className="text-[10px] sm:text-xs font-mono font-medium text-[var(--brand-primary)] tracking-wide uppercase">
                          {pillar.badge}
                        </span>
                      )}
                    </div>
                  )}

                  <h3 className="font-bold text-xs sm:text-base text-[var(--text-primary)] leading-snug group-hover:text-[var(--brand-primary)] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-[11px] sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light line-clamp-3 sm:line-clamp-none">
                    {pillar.description}
                  </p>
                </div>

                {pillar.link && (
                  <div className="pt-2 sm:pt-3 flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-[var(--brand-primary)] group-hover:translate-x-0.5 transition-transform">
                    <span>Read more</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                )}
              </>
            );

            return (
              <StaggerItem key={pillar.id || `pillar-${idx}`} yOffset={20}>
                <InteractiveCard
                  hoverY={-4}
                  className="h-full p-3 sm:p-6 rounded-md border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)]/60 hover:shadow-md transition-all flex flex-col justify-between shadow-xs group overflow-hidden"
                >
                  {pillar.link ? (
                    <Link href={pillar.link} className="flex flex-col h-full justify-between">
                      {cardInner}
                    </Link>
                  ) : (
                    <div className="flex flex-col h-full justify-between">
                      {cardInner}
                    </div>
                  )}
                </InteractiveCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

      </div>
    </section>
  );
}
