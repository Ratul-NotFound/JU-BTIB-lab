"use client";

import * as React from "react";
import Image from "next/image";
import { 
  Wind, 
  Sun, 
  Quote, 
  Sliders, 
  Activity,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

type Mode = "mechanics" | "biology" | "impact";

export function PhotobioreactorInteractive() {
  const [mode, setMode] = React.useState<Mode>("mechanics");
  const [lightLux, setLightLux] = React.useState<number>(8500); // 2000 to 15000 Lux
  const [flowRate, setFlowRate] = React.useState<number>(12); // 4 to 25 L/min

  // Biological kinetics based on Chlorella vulgaris saturation curves
  const photosyntheticEfficiency = Math.min(1, lightLux / 10000);
  const carbonFixationRateGramsDay = Math.round((flowRate * 14.5 * photosyntheticEfficiency) * 10) / 10;
  const oxygenProducedLitersDay = Math.round(carbonFixationRateGramsDay * 1.08 * 10) / 10;
  const treeEquivalence = Math.round((oxygenProducedLitersDay / 120) * 10) / 10;

  return (
    <section className="w-full border-y border-[var(--border)] bg-[var(--surface)] px-6 sm:px-12 lg:px-20 py-20 sm:py-28 space-y-14">
      {/* Top Editorial Header */}
      <div className="border-b border-[var(--border)] pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="editorial-kicker">Signature Research Project</span>
              <span className="text-[var(--border-strong)]">•</span>
              <span className="text-xs font-mono text-[var(--bio-teal)] font-medium">
                PILOT-SCALE URBAN DEPLOYMENT
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              The Liquid-Tree Photobioreactor
            </h2>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed font-light">
              An indigenous urban air purification system designed and constructed at Jahangirnagar University, 
              capturing metropolitan carbon dioxide through dense microalgal biotechnology.
            </p>
          </div>

          {/* Interactive View Switcher */}
          <div className="flex items-center p-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] self-start md:self-auto shadow-2xs">
            <button
              type="button"
              onClick={() => setMode("mechanics")}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                mode === "mechanics"
                  ? "bg-[var(--surface)] text-[var(--bio-teal)] font-semibold shadow-xs border border-[var(--border)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              System Mechanics
            </button>
            <button
              type="button"
              onClick={() => setMode("biology")}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                mode === "biology"
                  ? "bg-[var(--surface)] text-[var(--bio-teal)] font-semibold shadow-xs border border-[var(--border)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Chlorella Strain
            </button>
            <button
              type="button"
              onClick={() => setMode("impact")}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                mode === "impact"
                  ? "bg-[var(--surface)] text-[var(--bio-teal)] font-semibold shadow-xs border border-[var(--border)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Urban Impact
            </button>
          </div>
        </div>
      </div>

      {/* Main Exhibition Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Authentic Photography & Visual Telemetry */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative aspect-16/10 rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--surface-raised)] shadow-md group">
            {/* Real verified photography of pilot-scale processing setup */}
            <Image
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
              alt="Engineering researchers in lab coats operating pilot-scale industrial process equipment"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Overlaid Real-Time Telemetry Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-300 border border-white/20 shadow-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Culture Run
              </span>
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-xs">
                250 L Working Volume
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/15 text-xs text-white space-y-1">
              <div className="flex items-center justify-between font-mono font-medium">
                <span>Working Volume: 250 L</span>
                <span>pH: 7.2 – 7.6</span>
                <span>Cell Density: 1.8 × 10⁷ / mL</span>
              </div>
              <p className="text-[11px] text-white/70 font-light">
                Deployment Location: Department of Biotechnology & Genetic Engineering, Jahangirnagar University, Savar.
              </p>
            </div>
          </div>

          {/* Interactive Biological Simulator Controls */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[var(--bio-teal)]" />
                Real-Time Kinetic Simulation Controls
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)]">Live adjustment</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                  <span>Solar Irradiance:</span>
                  <span className="font-mono font-semibold text-[var(--bio-teal)]">{lightLux.toLocaleString()} Lux</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="15000"
                  step="500"
                  value={lightLux}
                  onChange={(e) => setLightLux(Number(e.target.value))}
                  className="w-full accent-[var(--bio-teal)] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                  <span>Air Intake Sparging:</span>
                  <span className="font-mono font-semibold text-[var(--bio-teal)]">{flowRate} L/min</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="25"
                  step="1"
                  value={flowRate}
                  onChange={(e) => setFlowRate(Number(e.target.value))}
                  className="w-full accent-[var(--bio-teal)] cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Output Ribbon */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[var(--border)] text-center">
              <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] uppercase font-mono text-[var(--text-muted)]">CO₂ Fixed</div>
                <div className="text-base sm:text-lg font-bold text-[var(--bio-emerald)] font-mono">
                  {carbonFixationRateGramsDay} g/day
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] uppercase font-mono text-[var(--text-muted)]">O₂ Produced</div>
                <div className="text-base sm:text-lg font-bold text-[var(--bio-cyan)] font-mono">
                  {oxygenProducedLitersDay} L/day
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] uppercase font-mono text-[var(--text-muted)]">Tree Equiv.</div>
                <div className="text-base sm:text-lg font-bold text-[var(--text-primary)] font-mono">
                  ~{treeEquivalence} Trees
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Deep Mode Explanations & Scientific Rigor */}
        <div className="lg:col-span-6 p-2 sm:p-4 flex flex-col justify-between space-y-8">
          {mode === "mechanics" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  Pneumatic Sparging & Mass Transfer Dynamics
                </h3>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2.5 leading-relaxed font-light">
                  The Liquid-Tree reactor utilizes an airlift loop with micro-porous ceramic spargers at the bottom 
                  of the 250-liter borosilicate glass column. Ambient air from Savar’s traffic corridors is drawn 
                  through an intake filter and dispersed as ultra-fine microbubbles (&lt; 1.5 mm diameter).
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] space-y-1.5">
                  <div className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <Wind className="w-4 h-4 text-[var(--bio-teal)]" />
                    Gas-Liquid Interfacial Mass Transfer
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-light">
                    By generating fine microbubbles, the volumetric mass transfer coefficient (kLa) exceeds 0.018 s⁻¹, 
                    ensuring high dissolution of CO₂ into the aqueous culture before gas reaches the surface exhaust.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] space-y-1.5">
                  <div className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-500" />
                    Photoperiod & Light Harvesting
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-light">
                    Operates on a natural diurnal daylight cycle at Jahangirnagar University, supplemented with 
                    internal photosynthetic photon flux density (PPFD) LED bands during monsoon cloud cover.
                  </p>
                </div>
              </div>
            </div>
          )}

          {mode === "biology" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  Indigenous <em>Chlorella vulgaris</em> JU-Strain
                </h3>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2.5 leading-relaxed font-light">
                  Isolated from local freshwater bodies around Jahangirnagar University, this robust green microalga 
                  features high cellular chlorophyll content and high resistance to temperature fluctuations (20°C–38°C) 
                  typical of the tropical climate in Bangladesh.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-xs">
                <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] space-y-1">
                  <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Growth Rate (μmax)</div>
                  <div className="text-base font-bold text-[var(--text-primary)] font-mono">0.052 h⁻¹</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-light">Doubling every ~13.3 hours</div>
                </div>

                <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] space-y-1">
                  <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Biomass Productivity</div>
                  <div className="text-base font-bold text-[var(--bio-teal)] font-mono">0.38 g/(L·day)</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-light">Dry cell weight metric</div>
                </div>
              </div>
            </div>
          )}

          {mode === "impact" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  Metropolitan Decarbonization & Clean Air
                </h3>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2.5 leading-relaxed font-light">
                  In dense urban environments like Dhaka where space for mature urban trees is constrained, a single 
                  250L Liquid-Tree unit achieves the daily oxygen output and carbon sequestration of 1 to 2 mature 10-year-old trees 
                  within a compact footprint of less than 2 square meters.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] space-y-2">
                <div className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  Continuous Biomass Harvest
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-light">
                  Algal biomass harvested weekly from the column is centrifugally pelleted and transferred to BTIB Lab for downstream 
                  valorization into agricultural bio-fertilizers and lipid feedstock.
                </p>
              </div>
            </div>
          )}

          {/* PI Quote Card */}
          <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] space-y-4">
            <Quote className="w-6 h-6 text-[var(--bio-teal)] opacity-60" />
            <p className="text-sm sm:text-base font-serif italic text-[var(--text-primary)] leading-relaxed">
              &ldquo;Our vision is to move biotechnology out of enclosed laboratories and into the civic landscape. 
              Liquid-Tree proves that living microalgae can act as decentralized bio-filters for Bangladesh’s urban future.&rdquo;
            </p>
            <div className="pt-2 flex items-center justify-between border-t border-[var(--border)]">
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)]">
                  Prof. Mohammad Shahedur Rahman
                </div>
                <div className="text-[11px] font-mono text-[var(--bio-teal)]">
                  Principal Investigator, BTIB Lab
                </div>
              </div>
              <Link
                href="/projects/liquid-tree-photobioreactor"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--bio-teal)] hover:underline"
              >
                Project report <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
