"use client";

import * as React from "react";
import Image from "next/image";
import { 
  Microscope, 
  FlaskConical, 
  Gauge, 
  Dna, 
  Rocket, 
  CheckCircle2, 
  Layers
} from "lucide-react";

interface PipelineStage {
  step: string;
  phase: string;
  title: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  imageAlt: string;
  description: string;
  inputs: string[];
  outputs: string[];
  parameters: Array<{ label: string; value: string }>;
}

const STAGES: PipelineStage[] = [
  {
    step: "01",
    phase: "Sampling & Isolation",
    title: "Environmental Bioprospecting",
    tagline: "Uncovering indigenous microbial diversity across Bangladesh",
    icon: Microscope,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Natural bioresources and ecological environmental sampling in Bangladesh",
    description:
      "Targeted sampling of Bangladesh's diverse ecological niches—including wetlands of Jahangirnagar University, mangrove sediments of the Sundarbans, and agro-industrial waste streams—to isolate novel wild-type microbial strains with unique metabolic capabilities.",
    inputs: ["Raw wetland water samples", "Agricultural biomass effluents", "River sediment cores"],
    outputs: ["Pure microbial isolates", "Cryopreserved strain libraries", "Baseline metagenomic reads"],
    parameters: [
      { label: "Isolation Method", value: "Selective serial dilution & enrichment" },
      { label: "Screening Target", value: "Lipolytic & amylolytic biocatalysts" },
      { label: "Storage Protocol", value: "Ultra-low -80°C with 20% glycerol" },
    ],
  },
  {
    step: "02",
    phase: "Physiological Profiling",
    title: "Strain Characterization & Kinetics",
    tagline: "Physiological profiling in controlled shake flask systems",
    icon: FlaskConical,
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Fluorescent cellular microscopy and physiological characterization",
    description:
      "Quantitative kinetic characterization in controlled orbital shakers. Isolates undergo biochemical assays to evaluate specific growth rates (μmax), substrate consumption kinetics, thermal tolerance ranges, and enzyme secretion profiles.",
    inputs: ["Pure cryostocks", "Defined minimal salt media", "Renewable carbon sources"],
    outputs: ["Growth kinetic curves", "Specific growth rate constants", "Enzyme activity titres"],
    parameters: [
      { label: "Culture Vessels", value: "250 mL – 1000 mL Erlenmeyer flasks" },
      { label: "Agitation Rate", value: "120 – 180 RPM orbital shaking" },
      { label: "Incubation Range", value: "30°C – 37°C precision control" },
    ],
  },
  {
    step: "03",
    phase: "Bioprocess Scale-Up",
    title: "Bioprocess Engineering & Fermentation",
    tagline: "Statistical media optimization and stirred-tank kinetics",
    icon: Gauge,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Laboratory glassware and fermentation kinetic equipment on clean bench",
    description:
      "Scaling cultures from shake flasks to benchtop stirred-tank bioreactors. Employing statistical Design of Experiments (DoE) and Response Surface Methodology (RSM) to optimize dissolved oxygen (DO), sparging rates, pH, and nutrient feed strategies.",
    inputs: ["Screened hyper-producing strains", "Optimized media formulations", "Precision air/gas mixtures"],
    outputs: ["Scalable cultivation protocols", "Mass transfer coefficients (kLa)", "Volumetric productivity rates"],
    parameters: [
      { label: "Reactor Systems", value: "Stirred-tank & Pneumatic airlift" },
      { label: "Parameter Control", value: "Real-time galvanic pH and DO probes" },
      { label: "Scale Milestone", value: "Bench to 20-Liter intermediate" },
    ],
  },
  {
    step: "04",
    phase: "Pilot Photobioreactor",
    title: "Pilot Photobioreactor Cultivation",
    tagline: "250-Liter Liquid-Tree mass microalgal culture",
    icon: Dna,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Engineering researchers operating pilot-scale industrial process equipment",
    description:
      "Deploying high-density microalgal cultures (such as Chlorella vulgaris) in the 250-liter Liquid-Tree photobioreactor column on university grounds. Balancing natural diurnal sunlight with internal LED arrays for maximum carbon dioxide fixation.",
    inputs: ["Inoculum culture (10% v/v)", "Urban ambient air intake", "Solar irradiance"],
    outputs: ["High-density algal biomass", "Oxygen-enriched exhaust", "Daily CO₂ sequestration logs"],
    parameters: [
      { label: "Reactor Volume", value: "250 Liters continuous loop" },
      { label: "Biomass Density", value: "1.2 – 2.4 g/L dry cell weight" },
      { label: "CO₂ Capture", value: "Equivalent to 1-2 mature trees" },
    ],
  },
  {
    step: "05",
    phase: "Downstream Refining",
    title: "Downstream Valorization & Bioproducts",
    tagline: "Purification into enzymes, bio-fertilizers, and bio-energy",
    icon: Rocket,
    image: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Researcher dispensing refined biological assays into microtube array",
    description:
      "Translating harvested biological biomass into high-value bioproducts. Centrifugal dewatering, cell disruption, chromatographic purification (HPLC), and formulation into sustainable agricultural bio-fertilizers, industrial enzymes, and bio-energy precursors.",
    inputs: ["Harvested fermentation broths", "Pelleted algal biomass", "Purification buffers"],
    outputs: ["Bio-fertilizer formulations", "Purified enzyme fractions", "Lipid feedstock for biodiesel"],
    parameters: [
      { label: "Dewatering", value: "Continuous centrifugation" },
      { label: "Analytical Verification", value: "HPLC & Spectrophotometry" },
      { label: "Societal Translation", value: "Sustainable bio-inputs for Bangladesh" },
    ],
  },
];

export function ScrollytellingProcess() {
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const current = STAGES[activeStep];

  return (
    <section className="w-full px-6 sm:px-12 lg:px-20 py-20 sm:py-28 space-y-12 bg-[var(--background)] border-t border-[var(--border)]">
      <div className="space-y-3 max-w-3xl">
        <div className="flex items-center gap-2">
          <span className="editorial-kicker">Translational Methodology</span>
          <span className="text-[var(--border-strong)]">•</span>
          <span className="text-xs font-mono text-[var(--bio-teal)] font-medium">
            5-STAGE SCIENTIFIC PIPELINE
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
          How the Laboratory Works
        </h2>
        <p className="text-base text-[var(--text-secondary)] leading-relaxed font-light">
          A continuous translational pipeline connecting environmental sampling in Bangladesh to 
          molecular characterization, kinetic bioprocess scale-up, and sustainable bioproducts.
        </p>
      </div>

      {/* 5-Step Process Selector Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        {STAGES.map((s, idx) => {
          const isActive = idx === activeStep;
          const StageIcon = s.icon;
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`p-4 sm:p-5 rounded-3xl border text-left transition-all flex flex-col justify-between gap-3 ${
                isActive
                  ? "border-[var(--bio-teal)] bg-[var(--surface)] shadow-md ring-1 ring-[var(--bio-teal)]/30"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-xs font-mono font-semibold ${
                  isActive ? "text-[var(--bio-teal)]" : "text-[var(--text-muted)]"
                }`}>
                  STAGE {s.step}
                </span>
                <div className={`p-1.5 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-[var(--bio-teal)]/10 text-[var(--bio-teal)]" 
                    : "text-[var(--text-muted)]"
                }`}>
                  <StageIcon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className={`text-sm font-semibold tracking-tight transition-colors line-clamp-1 ${
                  isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                }`}>
                  {s.title}
                </div>
                <div className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                  {s.phase}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detailed Exhibition Card */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border)]">
          {/* Left: Authentic Photography of This Stage */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="editorial-kicker">Stage {current.step} Workflow</span>
                <span className="text-[var(--border-strong)]">•</span>
                <span className="text-xs font-mono text-[var(--bio-teal)] font-medium">{current.phase}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                {current.title}
              </h3>
              <p className="text-xs font-mono text-[var(--bio-teal)]">
                {current.tagline}
              </p>
            </div>

            <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-[var(--border)] shadow-md group">
              <Image
                src={current.image}
                alt={current.imageAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-xs text-white bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15">
                {current.imageAlt}
              </div>
            </div>

            {/* Quick navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                className="px-3.5 py-2 rounded-xl text-xs font-medium border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-40 transition-colors"
              >
                ← Previous Stage
              </button>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                Stage {activeStep + 1} of {STAGES.length}
              </span>
              <button
                type="button"
                disabled={activeStep === STAGES.length - 1}
                onClick={() => setActiveStep((prev) => Math.min(STAGES.length - 1, prev + 1))}
                className="px-3.5 py-2 rounded-xl text-xs font-medium bg-[var(--bio-teal)] hover:bg-[var(--bio-teal-hover)] text-white disabled:opacity-40 transition-colors"
              >
                Next Stage →
              </button>
            </div>
          </div>

          {/* Right: Detailed Scientific Parameters & Deliverables */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-7">
            <div>
              <h4 className="text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider">
                Methodological Protocol
              </h4>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mt-2.5 font-light">
                {current.description}
              </p>
            </div>

            {/* Key Operating Parameters */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider">
                Key Operating Parameters
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {current.parameters.map((p) => (
                  <div
                    key={p.label}
                    className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] space-y-1"
                  >
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                      {p.label}
                    </div>
                    <div className="text-xs font-semibold text-[var(--text-primary)]">
                      {p.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inputs & Outputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] space-y-2.5">
                <span className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[var(--text-muted)]" />
                  Primary Research Inputs
                </span>
                <ul className="space-y-1.5 text-xs text-[var(--text-secondary)] font-light">
                  {current.inputs.map((inp) => (
                    <li key={inp} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] space-y-2.5">
                <span className="text-xs font-semibold text-[var(--bio-teal)] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Verified Outputs & Milestones
                </span>
                <ul className="space-y-1.5 text-xs text-[var(--text-secondary)] font-light">
                  {current.outputs.map((out) => (
                    <li key={out} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
