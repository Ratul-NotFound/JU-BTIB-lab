import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Mail,
  Target,
  Award,
  Users,
  FlaskConical,
  Calendar,
  Layers,
  Cpu,
  Microscope,
  CheckCircle2,
} from "lucide-react";
import { getSiteSettings, getContentBlocks } from "@/server/queries/settings";
import { getTeamMembers } from "@/server/queries/team";
import { MemberCategory } from "@prisma/client";
import { getOrganizationJsonLd } from "@/lib/seo";

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

const MILESTONES = [
  {
    year: "2012",
    title: "Laboratory Foundation & Inception",
    tag: "Established",
    description:
      "Founded by Professor Mohammad Shahedur Rahman within the Department of Biotechnology & Genetic Engineering at Jahangirnagar University. Initiated systematic bioprospecting of indigenous microbial strains from wetland and riverine ecosystems across Bangladesh.",
  },
  {
    year: "2016",
    title: "Bioprocess Kinetics & Fermentation Suite",
    tag: "Expansion",
    description:
      "Commissioned automated 5-liter stirred-tank bioreactor systems (Sartorius Biostat), establishing closed-loop dissolved oxygen control and fermentation kinetic modeling for industrial enzymes.",
  },
  {
    year: "2019",
    title: "Enzyme Immobilization Breakthrough",
    tag: "Research Milestone",
    description:
      "Engineered novel multi-enzyme immobilized matrices for the production of high-fructose corn syrup (HFCS) and secondary metabolite conversion, bridging molecular chemistry and industrial catalysis.",
  },
  {
    year: "2021",
    title: "Environmental Biosorption & Genomic Surveillance",
    tag: "Civic Contribution",
    description:
      "Pioneered microbial biosorption filters for hexavalent chromium in Savar industrial runoff and contributed to national SARS-CoV-2 genomic epidemiology sequencing.",
  },
  {
    year: "2024",
    title: "250L Liquid-Tree Photobioreactor Deployment",
    tag: "Flagship Innovation",
    description:
      "Constructed and deployed Bangladesh's first operational 250-liter microalgal photobioreactor column, achieving continuous volumetric carbon sequestration equivalent to 2 mature urban trees.",
  },
  {
    year: "2026",
    title: "Circular Bioeconomy & Biopolymer Scaling",
    tag: "Current Horizon",
    description:
      "Expanding translational research into compostable agricultural-waste bioplastics, microbial biofertilizers, and high-cell-density pilot production for local industrial adoption.",
  },
];

const ACHIEVEMENTS = [
  {
    icon: Calendar,
    metric: "2012",
    label: "Year Established",
    detail: "14+ years of continuous translational biotechnology research at Jahangirnagar University.",
  },
  {
    icon: FlaskConical,
    metric: "250 L",
    label: "Liquid-Tree Photobioreactor",
    detail: "First operational urban microalgae carbon capture and oxygenation column in Bangladesh.",
  },
  {
    icon: Award,
    metric: "15+",
    label: "Peer-Reviewed Discoveries",
    detail: "Published across high-impact international journals indexed in PubMed, Elsevier, and Springer.",
  },
  {
    icon: Users,
    metric: "50+",
    label: "Alumni & Scholars Trained",
    detail: "B.Sc., M.Sc., and Ph.D. scholars now serving across global academic and industrial laboratories.",
  },
];

const CORE_FACILITIES = [
  {
    icon: FlaskConical,
    title: "Fermentation Kinetics Cleanroom",
    description:
      "Equipped with automated stirred-tank bioreactor systems with digital control loops for dissolved oxygen, agitation, pH, and nutrient feed kinetics.",
  },
  {
    icon: Cpu,
    title: "Liquid-Tree Photobioreactor Yard",
    description:
      "Pilot-scale cultivation columns utilizing Chlorella vulgaris for volumetric carbon mitigation, microalgal biomass harvesting, and urban oxygenation.",
  },
  {
    icon: Microscope,
    title: "Microbial Culture & Cryo Repository",
    description:
      "Deep-freeze -80°C strain preservation bank cataloging indigenous bacterial, fungal, and microalgal isolates collected from diverse ecological zones.",
  },
  {
    icon: Layers,
    title: "Analytical & Enzyme Assay Suite",
    description:
      "Dedicated chromatography, gel electrophoresis, and spectrophotometric instrumentation for catalytic rate determination and biopolymer characterization.",
  },
];

export default async function AboutPage() {
  const [settings, contentBlocks, teamMembers] = await Promise.all([
    getSiteSettings(),
    getContentBlocks(),
    getTeamMembers({ category: MemberCategory.PI_FACULTY }),
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
        <section className="p-4 sm:p-8 lg:p-12 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-center">
            
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              {/* Institutional Dual Badge */}
              <div className="flex items-center gap-2 sm:gap-3 w-fit p-1 sm:p-1.5 pr-3 sm:pr-4 rounded-full border border-[var(--border)] bg-[var(--surface-raised)]/70">
                <div className="w-6 h-6 sm:w-8 sm:h-8 relative shrink-0 flex items-center justify-center">
                  <Image
                    src="/images/btib-logo.png"
                    alt="BTIB Laboratory"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain theme-invert-dark"
                  />
                </div>
                <span className="w-px h-3.5 sm:h-4 bg-[var(--border)]" />
                <div className="w-5 h-5 sm:w-7 sm:h-7 relative shrink-0 flex items-center justify-center">
                  <Image
                    src="/images/ju-logo.png"
                    alt="Jahangirnagar University"
                    width={28}
                    height={28}
                    className="w-full h-full object-contain theme-invert-dark"
                  />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-[var(--text-primary)]">
                  BTIB Lab · Jahangirnagar University
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.12] sm:leading-[1.08]">
                Bridging Indigenous Bioresources & <span className="text-[var(--brand-primary)]">Scalable Biotechnology</span>
              </h1>

              <p className="text-xs sm:text-base lg:text-lg text-[var(--text-secondary)] leading-relaxed font-light">
                {getBlockText(blockMap.get("about.history")?.content) ||
                  "Established in 2012 by Professor Mohammad Shahedur Rahman within the Department of Biotechnology and Genetic Engineering at Jahangirnagar University, BTIB Lab operates as a multidisciplinary research hub dedicated to bioprospecting indigenous microorganisms, optimizing fermentation kinetics, and engineering sustainable bioprocesses."}
              </p>

              <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono text-[var(--text-muted)]">
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]">
                  <Compass className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                  <span>Motto: {settings?.tagline || "From bioresource to bioproduct"}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]">
                  <span>Dept. of BGE · Savar, Dhaka-1342</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-[2.1/1] sm:aspect-[4/3] rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface-raised)] shadow-xs">
              <Image
                src="/images/facilities/cleanroom-pilot.jpg"
                alt="Cleanroom pilot bioprocessing suite at Jahangirnagar University"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 text-[10px] sm:text-xs text-white bg-black/65 backdrop-blur-md px-2.5 sm:px-4 py-1.5 sm:py-3 rounded-lg sm:rounded-xl border border-white/15">
                <span className="font-bold block text-xs sm:text-sm">BTIB Pilot Bioprocessing Suite</span>
                Savar, Dhaka · Department of Biotechnology & Genetic Engineering
              </div>
            </div>

          </div>
        </section>

        {/* 2. Key Impact Metrics */}
        <section className="space-y-3.5 sm:space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-3xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-tight">
              Laboratory Benchmarks & <span className="text-[var(--brand-primary)]">Impact</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {ACHIEVEMENTS.map((ach) => {
              const Icon = ach.icon;
              return (
                <div
                  key={ach.label}
                  className="p-3 sm:p-6 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1.5 sm:space-y-3 shadow-xs hover:border-[var(--brand-primary)] transition-all flex flex-col justify-between"
                >
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
              );
            })}
          </div>
        </section>

        {/* 3. Balanced 2-Column History: Narrative on Left, Chronological Milestones on Right */}
        <section className="space-y-4 sm:space-y-8">
          <div className="space-y-1.5 max-w-3xl">
            <h2 className="text-xl sm:text-3xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-tight">
              Full History: <span className="text-[var(--brand-primary)]">2012 to Present</span>
            </h2>
            <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed font-light">
              From an exploratory academic screening initiative to a national center for bioprocess engineering and urban photobioreactors in Bangladesh.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-12 items-start">
            
            {/* Left Narrative Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6 lg:sticky lg:top-24">
              <div className="p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-3 sm:space-y-5 shadow-xs">
                <h3 className="text-base sm:text-2xl font-bold text-[var(--text-primary)] leading-snug">
                  Transforming Local Biodiversity into <span className="text-[var(--brand-primary)]">Sustainable Bio-Solutions</span>
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light">
                  When Professor Mohammad Shahedur Rahman founded BTIB Lab in 2012, academic research in Bangladesh predominantly centered on basic organism isolation without industrial translation. BTIB was conceived to bridge this vital gap: connecting molecular biology with bioreactor scale-up engineering.
                </p>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light">
                  Over the past 14 years, the laboratory has systematically isolated and cryopreserved over 120 indigenous microbial strains, trained more than 50 research scholars, and produced patentable bioprocess breakthroughs in enzyme immobilization and photosynthetic microalgal carbon capture.
                </p>
                <div className="pt-3 sm:pt-4 border-t border-[var(--border)] flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-center font-serif font-bold text-xs sm:text-sm text-[var(--brand-primary)] shrink-0">
                    SR
                  </div>
                  <div className="text-[11px] sm:text-xs">
                    <span className="font-bold block text-[var(--text-primary)]">Prof. Mohammad Shahedur Rahman</span>
                    <span className="text-[var(--text-muted)]">Founding Director & Principal Investigator</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Milestones Column (7 cols) */}
            <div className="lg:col-span-7 space-y-2.5 sm:space-y-4">
              {MILESTONES.map((m, idx) => (
                <div
                  key={m.year}
                  className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)] transition-all shadow-xs space-y-1.5 sm:space-y-2.5"
                >
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
              ))}
            </div>

          </div>
        </section>

        {/* 4. Strategic Pillars: Mission, Vision & Scientific Values */}
        <section className="space-y-3.5 sm:space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-tight">
              Mission, Vision & <span className="text-[var(--brand-primary)]">Core Values</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
            <div className="p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-2 sm:space-y-4 shadow-xs">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] w-fit">
                <Target className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-xl font-bold font-sans text-[var(--text-primary)]">
                Our Mission
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light">
                {getBlockText(blockMap.get("about.mission")?.content) ||
                  "To systematically harness indigenous biological diversity, engineer novel microbial biocatalysts, and develop cost-effective, sustainable bioprocess technologies that translate into scalable environmental and industrial solutions for Bangladesh and the global scientific community."}
              </p>
            </div>

            <div className="p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-2 sm:space-y-4 shadow-xs">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] w-fit">
                <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-xl font-bold font-sans text-[var(--text-primary)]">
                Our Vision
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light">
                {getBlockText(blockMap.get("about.vision")?.content) ||
                  "To establish Jahangirnagar University as a premier regional hub for bioresource valorization and bioprocess innovation, bridging the gap between fundamental molecular discoveries and industrial biotechnology applications."}
              </p>
            </div>

            <div className="p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-2 sm:space-y-4 shadow-xs">
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
          </div>
        </section>

        {/* 5. Core Research Facilities & Infrastructure */}
        <section className="space-y-3.5 sm:space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-tight">
              Core Facilities & <span className="text-[var(--brand-primary)]">Laboratory Suites</span>
            </h2>
            <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed font-light">
              Situated in the Department of Biotechnology & Genetic Engineering, BTIB Lab houses specialized suites for benchtop fermentation, molecular screening, and pilot-scale photobioreactors.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {CORE_FACILITIES.map((facility) => {
              const Icon = facility.icon;
              return (
                <div
                  key={facility.title}
                  className="p-3 sm:p-6 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-2 sm:space-y-3 shadow-xs"
                >
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
              );
            })}
          </div>
        </section>

        {/* 6. Faculty Leadership Spotlight (PI) */}
        {pi && (
          <section className="p-4 sm:p-8 lg:p-12 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4 sm:space-y-8">
            <div className="border-b border-[var(--border)] pb-2 sm:pb-3">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-sans text-[var(--text-primary)]">
                Faculty Leadership & <span className="text-[var(--brand-primary)]">Principal Investigator</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-3 sm:space-y-4">
                <div className="relative w-32 h-32 sm:w-52 sm:h-52 rounded-xl sm:rounded-2xl border border-[var(--border)] overflow-hidden shadow-xs bg-[var(--surface-raised)]">
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
                      className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--bio-teal)] transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{pi.email}</span>
                    </a>
                  )}
                  <Link
                    href="/publications"
                    className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--bio-teal)] transition-colors"
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
                          className="px-2.5 py-1 rounded-md sm:rounded-lg text-[11px] sm:text-xs border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] font-mono"
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
        <section className="p-4 sm:p-8 lg:p-12 rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 shadow-xs">
          <div className="space-y-1.5 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-tight">
              Conduct Thesis Research or Establish Joint <span className="text-[var(--brand-primary)]">R&D Collaborations</span>
            </h2>
            <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed font-light">
              BTIB Lab welcomes undergraduate thesis candidates (B.Sc.), graduate scholars (M.Sc., M.Phil., Ph.D.),
              and industrial partners seeking sustainable bioprocess optimization.
            </p>
          </div>

          <div className="shrink-0 pt-2 sm:pt-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shadow-[0_4px_18px_rgba(0,146,184,0.4)] transition-all active:scale-[0.98]"
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
