"use client";

import * as React from "react";
import { LucideIcon, Target, Compass, CheckCircle2 } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem, InteractiveCard } from "@/components/ui/reveal";

export function AboutSectionReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal direction="up" distance={18} className={className}>
      {children}
    </Reveal>
  );
}

export function AboutImpactMetrics({
  achievements,
}: {
  achievements: Array<{
    icon: LucideIcon;
    metric: string;
    label: string;
    detail: string;
  }>;
}) {
  return (
    <StaggerContainer
      staggerDelay={0.07}
      delayChildren={0.05}
      className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6"
    >
      {achievements.map((ach) => {
        const Icon = ach.icon;
        return (
          <StaggerItem key={ach.label} yOffset={20}>
            <InteractiveCard hoverY={-3} className="h-full">
              <div className="h-full p-3 sm:p-6 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1.5 sm:space-y-3 shadow-xs hover:border-[var(--brand-primary)]/60 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="text-2xl sm:text-4xl font-extrabold text-[var(--brand-primary)] font-sans tracking-tight">
                    {ach.metric}
                  </div>
                  <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-base text-[var(--text-primary)]">
                    {ach.label}
                  </div>
                  <p className="text-[11px] sm:text-sm text-[var(--text-secondary)] leading-snug sm:leading-relaxed font-light line-clamp-2 sm:line-clamp-none mt-0.5 sm:mt-1">
                    {ach.detail}
                  </p>
                </div>
              </div>
            </InteractiveCard>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}

export function AboutMilestonesList({
  milestones,
}: {
  milestones: Array<{
    year: string;
    title: string;
    tag: string;
    description: string;
  }>;
}) {
  return (
    <StaggerContainer
      staggerDelay={0.08}
      delayChildren={0.05}
      className="space-y-2.5 sm:space-y-4"
    >
      {milestones.map((m, idx) => (
        <StaggerItem key={m.year} yOffset={18}>
          <InteractiveCard hoverY={-2} className="w-full">
            <div className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)]/60 hover:shadow-md transition-all shadow-xs space-y-1.5 sm:space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-base sm:text-xl font-bold font-sans text-[var(--brand-primary)]">
                    {m.year}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-mono font-medium border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-muted)]">
                    {m.tag}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-mono text-[var(--text-muted)]">
                  Phase 0{idx + 1}
                </span>
              </div>

              <h4 className="text-sm sm:text-lg font-bold font-sans text-[var(--text-primary)]">
                {m.title}
              </h4>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light">
                {m.description}
              </p>
            </div>
          </InteractiveCard>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}

export function AboutFacilitiesGrid({
  facilities,
}: {
  facilities: Array<{
    icon: LucideIcon;
    title: string;
    description: string;
  }>;
}) {
  return (
    <StaggerContainer
      staggerDelay={0.07}
      delayChildren={0.05}
      className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6"
    >
      {facilities.map((facility) => {
        const Icon = facility.icon;
        return (
          <StaggerItem key={facility.title} yOffset={20}>
            <InteractiveCard hoverY={-3} className="h-full">
              <div className="h-full p-3 sm:p-6 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-2 sm:space-y-3 shadow-xs hover:border-[var(--brand-primary)]/60 transition-all flex flex-col justify-between">
                <div className="space-y-2 sm:space-y-3">
                  <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--border)] text-[var(--brand-primary)] w-fit">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-base text-[var(--text-primary)]">
                    {facility.title}
                  </h3>
                  <p className="text-[11px] sm:text-sm text-[var(--text-secondary)] leading-snug sm:leading-relaxed font-light line-clamp-3 sm:line-clamp-none">
                    {facility.description}
                  </p>
                </div>
              </div>
            </InteractiveCard>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}

export function AboutStrategicPillars({
  missionText,
  visionText,
}: {
  missionText: string;
  visionText: string;
}) {
  return (
    <StaggerContainer
      staggerDelay={0.08}
      delayChildren={0.05}
      className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6"
    >
      <StaggerItem yOffset={20}>
        <InteractiveCard hoverY={-3} className="h-full">
          <div className="h-full p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-2 sm:space-y-4 shadow-xs">
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] w-fit">
              <Target className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-base sm:text-xl font-bold font-sans text-[var(--text-primary)]">
              Our Mission
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light">
              {missionText}
            </p>
          </div>
        </InteractiveCard>
      </StaggerItem>

      <StaggerItem yOffset={20}>
        <InteractiveCard hoverY={-3} className="h-full">
          <div className="h-full p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-2 sm:space-y-4 shadow-xs">
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] w-fit">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-base sm:text-xl font-bold font-sans text-[var(--text-primary)]">
              Our Vision
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light">
              {visionText}
            </p>
          </div>
        </InteractiveCard>
      </StaggerItem>

      <StaggerItem yOffset={20}>
        <InteractiveCard hoverY={-3} className="h-full">
          <div className="h-full p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-2 sm:space-y-4 shadow-xs">
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] w-fit">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-base sm:text-xl font-bold font-sans text-[var(--text-primary)]">
              Scientific Values
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light">
              Rigorous empirical methodology, environmental stewardship, open academic dissemination, and uncompromising dedication to mentoring next-generation biotechnology scholars in Bangladesh.
            </p>
          </div>
        </InteractiveCard>
      </StaggerItem>
    </StaggerContainer>
  );
}
