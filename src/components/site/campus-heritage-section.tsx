import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Trees, ArrowRight } from "lucide-react";

export function CampusHeritageSection() {
  return (
    <section className="w-full border-t border-[var(--border)] bg-[var(--surface-raised)] px-6 sm:px-12 lg:px-20 py-20 sm:py-28">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Narrative Column */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="editorial-kicker">ECOLOGICAL HERITAGE & INSTITUTION</span>
                <span className="text-[var(--border-strong)]">•</span>
                <span className="text-xs font-mono text-[var(--bio-teal)] font-medium">
                  SAVAR, DHAKA-1342
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
                Rooted in Bangladesh’s Most Biodiverse University Campus
              </h2>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-light">
                Jahangirnagar University spans <strong>697 acres</strong> of preserved subtropical wetlands, 
                designated botanical gardens, and freshwater lakes famous across South Asia as seasonal sanctuaries 
                for migratory waterfowl.
              </p>

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-light">
                This natural ecosystem provides the <strong>Bioresources Technology and Industrial Biotechnology Laboratory</strong> with 
                an immediate living bio-repository. Our researchers systematically sample local waters, soil microbiomes, 
                and microalgal strains to uncover novel biocatalysts and extremophiles capable of tackling industrial challenges.
              </p>
            </div>

            {/* Field Coordinates & Key Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-[var(--border)]">
              <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
                <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] flex items-center gap-1.5">
                  <Trees className="w-3.5 h-3.5 text-emerald-600" />
                  Campus Reserve
                </div>
                <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
                  697 Acres
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">Subtropical flora & lakes</div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
                <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--bio-teal)]" />
                  Coordinates
                </div>
                <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
                  23.88°N, 90.26°E
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">Savar, Dhaka Division</div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-1 col-span-2 sm:col-span-1">
                <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 relative shrink-0">
                    <Image
                      src="/images/btib-logo.png"
                      alt="BTIB"
                      width={14}
                      height={14}
                      className="w-full h-full object-contain theme-invert-dark"
                    />
                  </div>
                  Department
                </div>
                <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
                  Dept. of BGE
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">Biotechnology & Genetic Eng.</div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--bio-teal)] hover:underline"
              >
                Learn more about our facilities & placement
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 relative aspect-4/3 rounded-3xl overflow-hidden border border-[var(--border)] shadow-md group">
            <Image
              src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80"
              alt="Lush green botanical tree canopy at Jahangirnagar University campus reserve in Savar, Dhaka"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-3.5 sm:p-4 rounded-2xl bg-black/65 backdrop-blur-md border border-white/15 text-xs text-white flex items-center gap-3">
              <div className="w-9 h-9 relative shrink-0 p-1 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Image
                  src="/images/ju-logo-white.png"
                  alt="JU Logo"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-bold text-white block text-sm">Jahangirnagar University Campus</span>
                <span className="text-white/80 text-[11px]">Savar, Dhaka — A national sanctuary of biodiversity.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
