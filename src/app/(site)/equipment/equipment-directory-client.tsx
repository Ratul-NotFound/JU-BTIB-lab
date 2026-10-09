"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Microscope,
  FlaskConical,
  Search,
  Filter,
  Layers,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Table as TableIcon,
  LayoutGrid,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { isChemicalItem } from "@/app/(admin)/admin/equipment/equipment-client";

export interface PublicEquipmentItem {
  id: string;
  name: string;
  category: string;
  description: string | null;
  imageUrl?: string | null;
  order: number;
}

export function EquipmentDirectoryClient({
  items,
}: {
  items: PublicEquipmentItem[];
}) {
  // View mode: Table View is default as requested for scientific laboratory directory
  const [viewMode, setViewMode] = React.useState<"table" | "grid">("table");
  // Tabs: "ALL" | "EQUIPMENT" | "CHEMICALS"
  const [activeTab, setActiveTab] = React.useState<"ALL" | "EQUIPMENT" | "CHEMICALS">("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDivision, setSelectedDivision] = React.useState<string>("ALL");
  const [selectedItem, setSelectedItem] = React.useState<PublicEquipmentItem | null>(null);

  const equipmentList = React.useMemo(
    () => items.filter((item) => !isChemicalItem(item.category)),
    [items]
  );

  const chemicalList = React.useMemo(
    () => items.filter((item) => isChemicalItem(item.category)),
    [items]
  );

  // Extract unique divisions based on active view
  const availableDivisions = React.useMemo(() => {
    const targetItems =
      activeTab === "EQUIPMENT"
        ? equipmentList
        : activeTab === "CHEMICALS"
        ? chemicalList
        : items;
    const divisions = Array.from(new Set(targetItems.map((i) => i.category)));
    return divisions.sort();
  }, [items, equipmentList, chemicalList, activeTab]);

  // Reset division when switching tabs
  const handleTabChange = (tab: "ALL" | "EQUIPMENT" | "CHEMICALS") => {
    setActiveTab(tab);
    setSelectedDivision("ALL");
  };

  // Filter items
  const filterList = (list: PublicEquipmentItem[]) => {
    return list.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDivision =
        selectedDivision === "ALL" || item.category === selectedDivision;

      return matchesSearch && matchesDivision;
    });
  };

  const filteredEquipment = filterList(equipmentList);
  const filteredChemicals = filterList(chemicalList);

  return (
    <div className="space-y-10 sm:space-y-16">
      {/* Interactive Controls Bar: Segmented Switcher & Search Bar */}
      <div className="p-4 sm:p-6 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Main 2-Section Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-md bg-[var(--surface-raised)] border border-[var(--border)] text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleTabChange("ALL")}
              className={`px-3 py-2 rounded transition-all text-center flex items-center justify-center gap-1.5 ${
                activeTab === "ALL"
                  ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-xs border border-[var(--border)] font-bold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All ({items.length})</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("EQUIPMENT")}
              className={`px-3 py-2 rounded transition-all text-center flex items-center justify-center gap-1.5 ${
                activeTab === "EQUIPMENT"
                  ? "bg-emerald-600 text-white shadow-xs font-bold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Microscope className="w-3.5 h-3.5" />
              <span>1. Equipment ({equipmentList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("CHEMICALS")}
              className={`px-3 py-2 rounded transition-all text-center flex items-center justify-center gap-1.5 ${
                activeTab === "CHEMICALS"
                  ? "bg-amber-600 text-white shadow-xs font-bold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>2. Chemicals ({chemicalList.length})</span>
            </button>
          </div>

          {/* Right controls: Search + View Mode Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 lg:max-w-xl lg:justify-end">
            {/* Real-time Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search instruments, chemicals, specs, grades..."
                className="w-full pl-9 pr-8 py-2 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Layout Toggle: Table View (default) vs Grid View */}
            <div className="flex items-center gap-1 p-1 rounded-md bg-[var(--surface-raised)] border border-[var(--border)] shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="Scientific Table Directory"
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === "table"
                    ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-xs border border-[var(--border)] font-bold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <TableIcon className="w-3.5 h-3.5 text-emerald-500" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Visual Card Grid"
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === "grid"
                    ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-xs border border-[var(--border)] font-bold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
            </div>
          </div>
        </div>

        {/* Division Filter Chips */}
        {availableDivisions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-[var(--border)] text-xs">
            <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Division:
            </span>
            <button
              type="button"
              onClick={() => setSelectedDivision("ALL")}
              className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors ${
                selectedDivision === "ALL"
                  ? "bg-[var(--brand-primary)] text-white font-semibold"
                  : "bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]"
              }`}
            >
              All Categories
            </button>
            {availableDivisions.map((division) => (
              <button
                key={division}
                type="button"
                onClick={() => setSelectedDivision(division)}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors ${
                  selectedDivision === division
                    ? "bg-[var(--brand-primary)] text-white font-semibold"
                    : "bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]"
                }`}
              >
                {division}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 1: Laboratory Equipment & Instrumentation */}
      {(activeTab === "ALL" || activeTab === "EQUIPMENT") && (
        <section id="laboratory-equipment" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Section 1
                </span>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  {filteredEquipment.length} instruments catalogued
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[var(--text-primary)] flex items-center gap-2.5">
                <Microscope className="w-6 h-6 text-emerald-500" />
                <span>Laboratory Equipment & Instrumentation</span>
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light max-w-2xl">
                Benchtop and pilot stirred-tank bioreactors, photobioreactor columns, spectroscopy units, centrifuges, and sterile cleanroom suites.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Calibrated & Operational
              </span>
            </div>
          </div>

          {filteredEquipment.length === 0 ? (
            <div className="p-8 text-center rounded-md border border-dashed border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] text-xs">
              No instruments match the selected filter.
            </div>
          ) : viewMode === "table" ? (
            /* SCIENTIFIC TABLE VIEW */
            <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse min-w-[760px]">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      <th className="py-3 px-4 w-14 text-center">Ref #</th>
                      <th className="py-3 px-4 min-w-[280px]">Instrument & Model</th>
                      <th className="py-3 px-4 min-w-[190px]">Laboratory Division</th>
                      <th className="py-3 px-4 min-w-[320px]">Technical Specifications & Scope</th>
                      <th className="py-3 px-4 min-w-[150px] text-center">Status</th>
                      <th className="py-3 px-4 w-28 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {filteredEquipment.map((item, index) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="group hover:bg-[var(--surface-raised)]/70 transition-colors cursor-pointer"
                      >
                        <td className="py-3.5 px-4 text-center font-mono text-xs text-[var(--text-muted)] font-semibold">
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded border border-[var(--border)] bg-[var(--surface-raised)] overflow-hidden shrink-0 relative flex items-center justify-center">
                              {item.imageUrl ? (
                                <Image
                                  src={item.imageUrl}
                                  alt={item.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                                  sizes="48px"
                                />
                              ) : (
                                <Microscope className="w-5 h-5 text-emerald-500/50" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-xs sm:text-sm text-[var(--text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 block">
                                {item.name}
                              </span>
                              <span className="text-[11px] font-mono text-[var(--text-muted)] block mt-0.5">
                                BTIB · Ref #{item.order || index + 1}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 whitespace-nowrap">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="text-xs text-[var(--text-secondary)] font-light line-clamp-2 leading-relaxed">
                            {item.description || "Calibrated benchtop and pilot scientific apparatus for biotechnology operations."}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Operational
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--surface-raised)] group-hover:bg-emerald-600 group-hover:text-white text-[var(--text-secondary)] border border-[var(--border)] transition-all whitespace-nowrap shadow-xs"
                          >
                            <span>Specs</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 bg-[var(--surface-raised)]/40 border-t border-[var(--border)] text-[11px] font-mono text-[var(--text-muted)] flex items-center justify-between">
                <span>Showing {filteredEquipment.length} equipment items</span>
                <span className="hidden sm:inline">Click any row to view full technical specifications & photos</span>
              </div>
            </div>
          ) : (
            /* CARD GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredEquipment.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer rounded-md border border-[var(--border)] bg-[var(--surface)] hover:border-emerald-500/50 transition-all hover:shadow-md flex flex-col overflow-hidden"
                >
                  {/* Image Banner */}
                  <div className="relative aspect-[16/10] w-full bg-[var(--surface-raised)] overflow-hidden border-b border-[var(--border)]">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-muted)] bg-gradient-to-br from-emerald-500/5 to-transparent">
                        <Microscope className="w-10 h-10 text-emerald-500/40 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-mono mt-2">BTIB Calibrated Facility</span>
                      </div>
                    )}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-1 rounded text-[10px] font-semibold backdrop-blur-md bg-black/60 text-white border border-white/20">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] font-light line-clamp-3 leading-relaxed">
                        {item.description || "High-precision instrumentation calibrated for biochemical kinetics and microbial cultivation at BTIB Lab."}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Operational
                      </span>
                      <span className="text-[11px] group-hover:text-[var(--text-primary)] flex items-center gap-1 transition-colors">
                        View Details <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* SECTION 2: Chemicals & Reagents */}
      {(activeTab === "ALL" || activeTab === "CHEMICALS") && (
        <section id="chemicals-and-reagents" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Section 2
                </span>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  {filteredChemicals.length} reagents catalogued
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[var(--text-primary)] flex items-center gap-2.5">
                <FlaskConical className="w-6 h-6 text-amber-500" />
                <span>Chemicals & Reagents</span>
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light max-w-2xl">
                Microbial culture media, analytical grade buffers, fine biochemicals, enzymes, selective antibiotics, and molecular biology assay reagents.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                AR / Molecular Grade
              </span>
            </div>
          </div>

          {filteredChemicals.length === 0 ? (
            <div className="p-8 text-center rounded-md border border-dashed border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] text-xs">
              No chemicals or reagents match the selected filter.
            </div>
          ) : viewMode === "table" ? (
            /* SCIENTIFIC CHEMICALS TABLE VIEW */
            <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse min-w-[760px]">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      <th className="py-3 px-4 w-14 text-center">Ref #</th>
                      <th className="py-3 px-4 min-w-[280px]">Reagent / Compound</th>
                      <th className="py-3 px-4 min-w-[190px]">Classification</th>
                      <th className="py-3 px-4 min-w-[320px]">Grade, Purity & Specifications</th>
                      <th className="py-3 px-4 min-w-[150px] text-center">Stock Status</th>
                      <th className="py-3 px-4 w-28 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {filteredChemicals.map((item, index) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="group hover:bg-[var(--surface-raised)]/70 transition-colors cursor-pointer"
                      >
                        <td className="py-3.5 px-4 text-center font-mono text-xs text-[var(--text-muted)] font-semibold">
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded border border-[var(--border)] bg-[var(--surface-raised)] overflow-hidden shrink-0 relative flex items-center justify-center">
                              {item.imageUrl ? (
                                <Image
                                  src={item.imageUrl}
                                  alt={item.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                                  sizes="48px"
                                />
                              ) : (
                                <FlaskConical className="w-5 h-5 text-amber-500/50" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-xs sm:text-sm text-[var(--text-primary)] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1 block">
                                {item.name}
                              </span>
                              <span className="text-[11px] font-mono text-[var(--text-muted)] block mt-0.5">
                                BTIB · Stock #{item.order || index + 1}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 whitespace-nowrap">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="text-xs text-[var(--text-secondary)] font-light line-clamp-2 leading-relaxed">
                            {item.description || "Analytical laboratory reagent standardized for research and experimental protocols."}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            AR / In Stock
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--surface-raised)] group-hover:bg-amber-600 group-hover:text-white text-[var(--text-secondary)] border border-[var(--border)] transition-all whitespace-nowrap shadow-xs"
                          >
                            <span>Details</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 bg-[var(--surface-raised)]/40 border-t border-[var(--border)] text-[11px] font-mono text-[var(--text-muted)] flex items-center justify-between">
                <span>Showing {filteredChemicals.length} reagents catalogued</span>
                <span className="hidden sm:inline">Click any row to view full specifications & reserve aliquots</span>
              </div>
            </div>
          ) : (
            /* CHEMICALS CARD GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredChemicals.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer rounded-md border border-[var(--border)] bg-[var(--surface)] hover:border-amber-500/50 transition-all hover:shadow-md flex flex-col overflow-hidden"
                >
                  {/* Image / Header Banner */}
                  <div className="relative aspect-[16/10] w-full bg-[var(--surface-raised)] overflow-hidden border-b border-[var(--border)]">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-muted)] bg-gradient-to-br from-amber-500/5 to-transparent">
                        <FlaskConical className="w-10 h-10 text-amber-500/40 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-mono mt-2">Analytical Reagent Grade</span>
                      </div>
                    )}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-1 rounded text-[10px] font-semibold backdrop-blur-md bg-black/60 text-white border border-white/20">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] font-light line-clamp-3 leading-relaxed">
                        {item.description || "High-purity chemical reagent and culture substrate standardized for laboratory trials and thesis research."}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                        <FlaskConical className="w-3.5 h-3.5" />
                        Reagent Stock
                      </span>
                      <span className="text-[11px] group-hover:text-[var(--text-primary)] flex items-center gap-1 transition-colors">
                        View Specs <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Detail & Protocol Modal */}
      {selectedItem && (
        <Dialog
          open={!!selectedItem}
          onOpenChange={(open) => !open && setSelectedItem(null)}
          size="3xl"
          title={selectedItem.name}
          description={`${isChemicalItem(selectedItem.category) ? "Chemical / Reagent Inventory Record" : "Laboratory Equipment & Technical Capacity"}`}
        >
          <div className="space-y-5 max-h-[75vh] overflow-y-auto px-1">
            {/* Modal Image */}
            {selectedItem.imageUrl ? (
              <div className="relative aspect-[16/9] w-full rounded-md overflow-hidden border border-[var(--border)] bg-[var(--surface-raised)]">
                <Image
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 700px"
                />
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded text-xs font-semibold bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--brand-primary)]">
                Division: {selectedItem.category}
              </span>
              <span
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  isChemicalItem(selectedItem.category)
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                }`}
              >
                {isChemicalItem(selectedItem.category) ? "Chemical & Reagent" : "Equipment & Instrument"}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Technical Specifications & Usage Notes
              </h4>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light whitespace-pre-line bg-[var(--surface-raised)] p-4 rounded-md border border-[var(--border)]">
                {selectedItem.description ||
                  "Standard laboratory instrumentation maintained by the Department of Biotechnology & Genetic Engineering at Jahangirnagar University."}
              </p>
            </div>

            <div className="p-4 rounded-md border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs">
                <span className="font-bold block text-[var(--text-primary)]">
                  Need to reserve this {isChemicalItem(selectedItem.category) ? "reagent" : "instrument"}?
                </span>
                <span className="text-[var(--text-muted)]">
                  Contact the laboratory directory to schedule thesis or collaboration access.
                </span>
              </div>
              <Link
                href={`/contact?subject=${encodeURIComponent(`Inquiry regarding ${selectedItem.name}`)}`}
                className="shrink-0 px-4 py-2 rounded-md text-xs font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white transition-all shadow-xs"
              >
                Submit Facility Inquiry →
              </Link>
            </div>
          </div>
        </Dialog>
      )}

      {/* Bottom Thesis & Research CTA */}
      <section className="p-6 sm:p-10 rounded-md border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 max-w-2xl">
          <h3 className="text-xl sm:text-2xl font-black font-sans text-[var(--text-primary)]">
            Access Laboratory Equipment & Chemical Inventories
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
            Undergraduate thesis students, graduate scholars, and inter-institutional research collaborators can request instrumentation slots and chemical aliquots.
          </p>
        </div>
        <Link
          href="/contact"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-md text-xs font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        >
          <span>Contact Lab In-Charge</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
