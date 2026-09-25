"use client";

import * as React from "react";
import { Sparkles, Activity, SunMedium, Wind } from "lucide-react";

export function PhotobioreactorScene() {
  const [bubbles, setBubbles] = React.useState<
    Array<{ id: number; left: number; size: number; delay: number; duration: number }>
  >([]);

  React.useEffect(() => {
    // Generate deterministic bubble animations
    const b = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: 15 + Math.random() * 70, // percentage within column
      size: 4 + Math.random() * 8, // px
      delay: Math.random() * 4, // s
      duration: 3 + Math.random() * 3.5, // s
    }));
    setBubbles(b);
  }, []);

  return (
    <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[var(--bio-teal)]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="specimen-tag text-[10px]">PROTOTYPE / PBR-250L</span>
            <span className="text-xs font-mono text-[var(--bio-teal)] font-medium">
              LIQUID-TREE (JU CAMPUS)
            </span>
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] mt-1">
            Urban Microalgae Photobioreactor Column
          </h3>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] bg-[var(--surface-raised)] px-2.5 py-1 rounded border border-[var(--border)]">
          <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>REAL-TIME KINETICS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Photobioreactor Column Diagram */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-48 h-80 rounded-3xl border-2 border-[var(--border-strong)] bg-gradient-to-b from-teal-950/20 via-emerald-900/30 to-teal-900/40 backdrop-blur-sm p-2 flex flex-col justify-between shadow-inner">
            {/* Top sparger / gas outlet manifold */}
            <div className="w-full flex justify-between items-center px-3 py-1 border-b border-[var(--border)] text-[9px] font-mono text-[var(--text-muted)]">
              <span>O₂ PURGE</span>
              <span>100% EXHAUST</span>
            </div>

            {/* Rising Bubbles Container */}
            <div className="relative flex-1 overflow-hidden">
              {bubbles.map((b) => (
                <div
                  key={b.id}
                  className="absolute bottom-0 rounded-full bg-teal-400/50 backdrop-blur-xs animate-bubble"
                  style={{
                    left: `${b.left}%`,
                    width: `${b.size}px`,
                    height: `${b.size}px`,
                    animationDelay: `${b.delay}s`,
                    animationDuration: `${b.duration}s`,
                  }}
                />
              ))}

              {/* Central fluid core representation */}
              <div className="absolute inset-x-4 inset-y-6 rounded-2xl bg-gradient-to-t from-[var(--bio-teal)]/25 to-cyan-500/15 border border-[var(--bio-teal)]/30 flex items-center justify-center">
                <span className="text-[10px] font-mono text-[var(--bio-teal)] font-semibold rotate-90 tracking-widest uppercase opacity-80 select-none">
                  Chlorella vulgaris
                </span>
              </div>
            </div>

            {/* Bottom sparger aerator */}
            <div className="w-full pt-2 border-t border-[var(--border)] flex items-center justify-between text-[9px] font-mono text-[var(--text-muted)] px-3">
              <span>CO₂ SPARGER</span>
              <span className="text-[var(--bio-teal)]">250 LITER</span>
            </div>
          </div>
        </div>

        {/* Operational Specifications & Verified Facts */}
        <div className="lg:col-span-7 space-y-4">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Engineered at Jahangirnagar University by Prof. Mohammad Shahedur Rahman and his
            research team, the <strong>Liquid-Tree</strong> system captures ambient urban
            carbon dioxide using high-density microalgal cultivation, achieving oxygen
            production rates comparable to mature deciduous trees within a compact physical footprint.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)]">
                <Wind className="w-3.5 h-3.5 text-[var(--bio-cyan)]" />
                <span>Working Volume</span>
              </div>
              <p className="text-xl font-bold font-mono text-[var(--text-primary)]">
                250 <span className="text-xs font-normal text-[var(--text-muted)]">Liters</span>
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">Continuous pneumatic loop</p>
            </div>

            <div className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)]">
                <SunMedium className="w-3.5 h-3.5 text-amber-500" />
                <span>PAR Efficiency</span>
              </div>
              <p className="text-xl font-bold font-mono text-[var(--text-primary)]">
                94.8% <span className="text-xs font-normal text-[var(--text-muted)]">Abs.</span>
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">Photosynthetic irradiance</p>
            </div>

            <div className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)]">
                <Sparkles className="w-3.5 h-3.5 text-[var(--bio-teal)]" />
                <span>Carbon Fixation</span>
              </div>
              <p className="text-xl font-bold font-mono text-[var(--text-primary)]">
                10-50× <span className="text-xs font-normal text-[var(--text-muted)]">vs Terrestrial</span>
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">Equivalent to adult tree</p>
            </div>

            <div className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)]">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                <span>Biomass Coproduct</span>
              </div>
              <p className="text-xl font-bold font-mono text-[var(--text-primary)]">
                Lipids & Biofertilizer
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">Circular bio-refinery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
