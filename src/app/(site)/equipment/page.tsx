import * as React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { getEquipmentList } from "@/server/queries/equipment";
import { EquipmentDirectoryClient } from "./equipment-directory-client";
import { Microscope, FlaskConical, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Equipment & Chemicals | BTIB Lab - Jahangirnagar University",
  description:
    "Explore the laboratory equipment, pilot-scale photobioreactors, stirred-tank fermenters, analytical instruments, and chemical reagent inventories of BTIB Laboratory.",
};

export const revalidate = 60;

export default async function EquipmentPage() {
  const items = await getEquipmentList(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-16 space-y-8 sm:space-y-12">
      {/* 1. Institutional Hero & Overview Banner */}
      <section className="p-4 sm:p-8 lg:p-12 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-4 sm:space-y-6 max-w-4xl">
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
              BTIB Lab · Department of Biotechnology & Genetic Engineering
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.12] sm:leading-[1.08]">
            Laboratory Equipment & Chemical Directory
          </h1>

          <p className="text-xs sm:text-base lg:text-lg text-[var(--text-secondary)] leading-relaxed font-light">
            Our facilities integrate benchtop and pilot-scale stirred-tank bioreactors, photobioreactor columns,
            high-performance analytical suites, and standardized high-purity chemical reagent inventories
            designed to support faculty investigations, thesis scholars, and industrial biotechnology translation.
          </p>

          {/* Capability Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-[var(--text-muted)]">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
              <Microscope className="w-4 h-4" />
              <span>1. Laboratory Equipment & Instrumentation</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400">
              <FlaskConical className="w-4 h-4" />
              <span>2. Chemicals & Reagents</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--surface-raised)]">
              <ShieldCheck className="w-4 h-4 text-[var(--brand-primary)]" />
              <span>BSL-1 / BSL-2 Compliant Cleanroom</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Directory Client with Search, Filters, and 2-Section Division */}
      <EquipmentDirectoryClient items={items} />
    </div>
  );
}
