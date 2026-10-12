import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Mail,
} from "lucide-react";
import {
  getSiteSettings,
  getContentBlocks,
  getAboutMilestonesSection,
  getAboutAchievementsSection,
  getAboutFacilitiesSection,
  getFacultyLeadershipSection,
} from "@/server/queries/settings";
import { getTeamMembers } from "@/server/queries/team";
import { MemberCategory } from "@prisma/client";
import { getOrganizationJsonLd } from "@/lib/seo";
import {
  AboutSectionReveal,
  AboutImpactMetrics,
  AboutMilestonesList,
  AboutFacilitiesGrid,
  AboutStrategicPillars,
} from "./about-interactive";

export const metadata: Metadata = {
  title: "About the Laboratory & History | BTIB Lab - Jahangirnagar University",
  description:
    "Explore the history, achievements, founding milestones, and academic mission of the Bioresources Technology and Industrial Biotechnology Laboratory from 2012 to present.",
};

export const revalidate = 60;

function getBlockText(content: unknown): string | null {
  if (content && typeof content === "object" && "text" in content) {
    const val = (content as { text?: unknown }).text;
    if (typeof val === "string") return val;
  }
  return null;
}

export default async function AboutPage() {
  const [
    settings,
    contentBlocks,
    teamMembers,
    milestonesData,
    achievementsData,
    facilitiesData,
    leadershipData,
  ] = await Promise.all([
    getSiteSettings(),
    getContentBlocks(),
    getTeamMembers({ category: MemberCategory.PI_FACULTY }),
    getAboutMilestonesSection(),
    getAboutAchievementsSection(),
    getAboutFacilitiesSection(),
    getFacultyLeadershipSection(),
  ]);

  const blockMap = new Map(contentBlocks.map((b) => [b.key, b]));
  const pi = teamMembers[0];

  const organizationJsonLd = getOrganizationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-16 space-y-8 sm:space-y-16">
        
        {/* 1. Institutional Hero & Overview Banner */}
        <section className="p-4 sm:p-8 lg:p-12 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-center">
            
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              {/* Institutional Dual Attribution */}
              <div className="flex items-center gap-2.5 sm:gap-3.5 pb-1">
                <div className="w-6 h-6 sm:w-8 sm:h-8 relative shrink-0 flex items-center justify-center">
                  <Image
                    src="/images/btib-logo.png"
                    alt="BTIB Laboratory"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain theme-invert-dark"
                  />
                </div>
                <span className="w-px h-4 sm:h-5 bg-[var(--border)]" />
                <div className="w-5 h-5 sm:w-7 sm:h-7 relative shrink-0 flex items-center justify-center">
                  <Image
                    src="/images/ju-logo.png"
                    alt="Jahangirnagar University"
                    width={28}
                    height={28}
                    className="w-full h-full object-contain theme-invert-dark"
                  />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)]">
                  BTIB Lab · Jahangirnagar University
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.12] sm:leading-[1.08]">
                Bridging Indigenous Bioresources & Scalable Biotechnology
              </h1>

              <p className="text-xs sm:text-base lg:text-lg text-[var(--text-secondary)] leading-relaxed font-light">
                {getBlockText(blockMap.get("about.history")?.content) ||
                  "Established in 2012 by Professor Mohammad Shahedur Rahman within the Department of Biotechnology and Genetic Engineering at Jahangirnagar University, BTIB Lab operates as a multidisciplinary research hub dedicated to bioprospecting indigenous microorganisms, optimizing fermentation kinetics, and engineering sustainable bioprocesses."}
              </p>

              <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono text-[var(--text-muted)]">
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]">
                  <Compass className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                  <span>Motto: {settings?.tagline || "From bioresource to bioproduct"}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]">
                  <span>Dept. of BGE · Savar, Dhaka-1342</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-[2.1/1] sm:aspect-[4/3] rounded-md overflow-hidden border border-[var(--border)] bg-[var(--surface-raised)] shadow-xs">
              <Image
                src={settings?.aboutHeroImage || "/images/facilities/cleanroom-pilot.jpg"}
                alt="Cleanroom pilot bioprocessing suite at Jahangirnagar University"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 text-[10px] sm:text-xs text-white bg-black/65 backdrop-blur-md px-2.5 sm:px-4 py-1.5 sm:py-3 rounded-md border border-white/15">
                <span className="font-bold block text-xs sm:text-sm">BTIB Pilot Bioprocessing Suite</span>
                Savar, Dhaka · Department of Biotechnology & Genetic Engineering
              </div>
            </div>

          </div>
        </section>

        {/* 2. Key Impact Metrics */}
        <AboutSectionReveal className="space-y-3.5 sm:space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-3xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-tight">
              {achievementsData.sectionTitle}
            </h2>
            {achievementsData.sectionSubtitle && (
              <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed font-light">
                {achievementsData.sectionSubtitle}
              </p>
            )}
          </div>

          <AboutImpactMetrics achievements={achievementsData.items} />
        </AboutSectionReveal>

        {/* 3. Balanced 2-Column History: Narrative on Left, Chronological Milestones on Right */}
        <section className="space-y-4 sm:space-y-8">
          <AboutSectionReveal className="space-y-1.5 max-w-3xl">
            <h2 className="text-xl sm:text-3xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-tight">
              {milestonesData.sectionTitle}
            </h2>
            <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed font-light">
              {milestonesData.sectionSubtitle}
            </p>
          </AboutSectionReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-12 items-start">
            
            {/* Left Narrative Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6 lg:sticky lg:top-24">
              <AboutSectionReveal>
                <div className="p-4 sm:p-8 rounded-md border border-[var(--border)] bg-[var(--surface)] space-y-3 sm:space-y-5 shadow-xs">
                  <h3 className="text-base sm:text-2xl font-bold text-[var(--text-primary)] leading-snug">
                    Transforming Local Biodiversity into Sustainable Bio-Solutions
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light">
                    When Professor Mohammad Shahedur Rahman founded BTIB Lab in 2012, academic research in Bangladesh predominantly centered on basic organism isolation without industrial translation. BTIB was conceived to bridge this vital gap: connecting molecular biology with bioreactor scale-up engineering.
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light">
                    Over the past 14 years, the laboratory has systematically isolated and cryopreserved over 120 indigenous microbial strains, trained more than 50 research scholars, and produced patentable bioprocess breakthroughs in enzyme immobilization and photosynthetic microalgal carbon capture.
                  </p>
                  <div className="pt-3 sm:pt-4 border-t border-[var(--border)] flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-center font-serif font-bold text-xs sm:text-sm text-[var(--brand-primary)] shrink-0">
                      SR
                    </div>
                    <div className="text-[11px] sm:text-xs">
                      <span className="font-bold block text-[var(--text-primary)]">
                        {leadershipData?.name || "Prof. Mohammad Shahedur Rahman"}
                      </span>
                      <span className="text-[var(--text-muted)]">
                        {leadershipData?.title || "Founding Director & Principal Investigator"}
                      </span>
                    </div>
                  </div>
                </div>
              </AboutSectionReveal>
            </div>

            {/* Right Milestones Column (7 cols) */}
            <div className="lg:col-span-7">
              <AboutMilestonesList milestones={milestonesData.items} />
            </div>

          </div>
        </section>

        {/* 4. Strategic Pillars: Mission, Vision & Scientific Values */}
        <section className="space-y-3.5 sm:space-y-6">
          <AboutSectionReveal className="space-y-1">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-tight">
              Mission, Vision & Core Values
            </h2>
          </AboutSectionReveal>

          <AboutStrategicPillars
            missionText={
              getBlockText(blockMap.get("about.mission")?.content) ||
              "To systematically harness indigenous biological diversity, engineer novel microbial biocatalysts, and develop cost-effective, sustainable bioprocess technologies that translate into scalable environmental and industrial solutions for Bangladesh and the global scientific community."
            }
            visionText={
              getBlockText(blockMap.get("about.vision")?.content) ||
              "To establish Jahangirnagar University as a premier regional hub for bioresource valorization and bioprocess innovation, bridging the gap between fundamental molecular discoveries and industrial biotechnology applications."
            }
          />
        </section>

        {/* 5. Core Research Facilities & Infrastructure */}
        <section className="space-y-3.5 sm:space-y-6">
          <AboutSectionReveal className="space-y-1">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-tight">
              {facilitiesData.sectionTitle}
            </h2>
            <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed font-light">
              {facilitiesData.sectionSubtitle}
            </p>
          </AboutSectionReveal>

          <AboutFacilitiesGrid facilities={facilitiesData.items} />
        </section>

        {/* 6. Faculty Leadership Spotlight (PI) */}
        {pi && (
          <section className="p-4 sm:p-8 lg:p-12 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4 sm:space-y-8">
            <div className="border-b border-[var(--border)] pb-2 sm:pb-3">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-sans text-[var(--text-primary)]">
                Faculty Leadership & Principal Investigator
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-3 sm:space-y-4">
                <div className="relative w-32 h-32 sm:w-52 sm:h-52 rounded-md border border-[var(--border)] overflow-hidden shadow-xs bg-[var(--surface-raised)]">
                  <Image
                    src={pi.photoUrl || "/images/team/shahedur-rahman.jpg"}
                    alt={pi.name}
                    fill
                    className="object-cover object-top"
                    sizes="208px"
                  />
                </div>
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold font-sans text-[var(--text-primary)]">
                    {pi.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-[var(--bio-teal)] font-semibold mt-0.5 sm:mt-1">
                    {pi.title || "Professor & Principal Investigator"}
                  </p>
                  <p className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5 sm:mt-1">
                    Dept. of Biotechnology & Genetic Engineering
                    <br />
                    Jahangirnagar University · Savar, Dhaka
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                  {pi.email && (
                    <a
                      href={`mailto:${pi.email}`}
                      className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono px-3 py-1.5 sm:px-3.5 sm:py-2 rounded border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--bio-teal)] transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{pi.email}</span>
                    </a>
                  )}
                  <Link
                    href="/publications"
                    className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono px-3 py-1.5 sm:px-3.5 sm:py-2 rounded border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--bio-teal)] transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Scholarly Output</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4 sm:space-y-6">
                <div>
                  <h4 className="text-[10px] sm:text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5 sm:mb-2">
                    Academic Biography & Research Trajectory
                  </h4>
                  <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed font-light">
                    {pi.bio ||
                      "Professor Mohammad Shahedur Rahman leads the Bioresources Technology and Industrial Biotechnology Laboratory. His research focuses on microbial biotechnology, fermentation kinetic engineering, enzyme immobilisation, and microalgae photobioreactors for carbon mitigation and environmental biotechnology."}
                  </p>
                </div>

                {pi.interests && pi.interests.length > 0 && (
                  <div className="pt-3 sm:pt-4 border-t border-[var(--border)] space-y-2 sm:space-y-3">
                    <span className="text-[10px] sm:text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                      Core Scholarly Disciplines & Research Domains
                    </span>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {pi.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-2.5 py-1 rounded text-[11px] sm:text-xs border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] font-mono"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 7. Thesis Admissions & Collaborations CTA */}
        <section className="p-4 sm:p-8 lg:p-12 rounded-md border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 shadow-xs">
          <div className="space-y-1.5 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-tight">
              Conduct Thesis Research or Establish Joint R&D Collaborations
            </h2>
            <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed font-light">
              BTIB Lab welcomes undergraduate thesis candidates (B.Sc.), graduate scholars (M.Sc., M.Phil., Ph.D.),
              and industrial partners seeking sustainable bioprocess optimization.
            </p>
          </div>

          <div className="shrink-0 pt-2 sm:pt-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3.5 rounded text-xs font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              <span>Inquire About Placements</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}
