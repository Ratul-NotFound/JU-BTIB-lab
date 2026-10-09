import * as React from "react";
import { Metadata } from "next";
import {
  ShieldCheck,
  Flame,
  Droplets,
  Microscope,
  Clock,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Safety Rules & SOPs | BTIB Portal",
  description: "Official laboratory protocols, standard operating procedures, and biosafety guidelines.",
};

const PROTOCOLS = [
  {
    title: "1. Personal Protective Equipment (PPE)",
    icon: ShieldCheck,
    color: "text-emerald-500",
    items: [
      "Laboratory coats must be buttoned at all times within the experimental bays.",
      "Appropriate safety goggles required during autoclave cycles, acid washes, and media prep.",
      "Powder-free nitrile gloves must be worn when handling microbial cultures and reagents.",
      "Open-toed footwear and shorts are strictly prohibited within the laboratory complex.",
    ],
  },
  {
    title: "2. Photobioreactor & Bioreactor Operations",
    icon: Microscope,
    color: "text-[var(--bio-teal)]",
    items: [
      "Inspect pH electrodes, dissolved oxygen (DO) probes, and air loops prior to seeding.",
      "Maintain continuous aeration flow rates within manufacturer-rated limits (max 2.5 vvm).",
      "Sterilize sampling ports with 70% ethanol flame sterilization before and after withdrawals.",
      "Log all temperature fluctuations and nutrient feeding schedules in the digital portal.",
    ],
  },
  {
    title: "3. Autoclave & Sterilization Protocols",
    icon: Flame,
    color: "text-amber-500",
    items: [
      "Do not overload the autoclave chamber; allow space for steam circulation.",
      "Verify that exhaust pressure has completely dropped to 0 psi before unlatching the hatch.",
      "Wear heat-resistant thermal gloves when removing hot liquid media and glassware.",
      "All biohazard waste must undergo validated 121°C / 20 min autoclaving prior to disposal.",
    ],
  },
  {
    title: "4. Chemical & Biohazardous Waste Segregation",
    icon: Droplets,
    color: "text-sky-500",
    items: [
      "Liquid microbial cultures must be chemically bleached (10% sodium hypochlorite) or autoclaved.",
      "Organic solvent waste (methanol, chloroform, acetone) must be pooled in designated carboys.",
      "Sharps, micro-pipette tips, and broken glassware must be placed exclusively in yellow sharps containers.",
      "Never discharge concentrated buffer salts or heavy metals into the university sink network.",
    ],
  },
  {
    title: "5. Floor Booking & Logbook Compliance",
    icon: Clock,
    color: "text-purple-500",
    items: [
      "All instrument use must be scheduled in advance through the BTIB Scholar Portal.",
      "Cancel bookings at least 4 hours in advance if your experimental timeline shifts.",
      "Wipe down analytical balances and spectrophotometer cuvettes immediately after use.",
      "Document experimental run parameters into the Thesis Logbook within 24 hours of session completion.",
    ],
  },
  {
    title: "6. Emergency Contacts & Protocol",
    icon: PhoneCall,
    color: "text-rose-500",
    items: [
      "Chemical spill on skin: Rinse under emergency eyewash / shower for a minimum of 15 minutes.",
      "Lab Principal Investigator: Prof. Dr. Md. Shahedur Rahman (Office: Room 204, BGE).",
      "Department Office: Biotechnology & Genetic Engineering, JU Campus, Savar (Ext. 1420).",
      "In case of thermal or electrical fire, trigger building alarm and utilize CO2 extinguisher.",
    ],
  },
];

export default function ScholarSopsPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Institutional Safety Directives</span>
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-[var(--surface-raised)] text-[var(--text-muted)] border border-[var(--border)]">
              BSL-1 &amp; BSL-2 Compliant
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[var(--text-primary)]">
            Standard Operating Procedures (SOPs)
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
            Essential guidelines, equipment safety manuals, and biosafety protocols for all researchers, scholars, and visiting scientists operating in the BTIB Laboratory.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/portal/book"
            className="px-4 py-2.5 rounded-md text-xs font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shadow-xs transition-all"
          >
            <span>Reserve Instrument</span>
          </Link>
        </div>
      </div>

      {/* Protocols Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROTOCOLS.map((proto) => {
          const Icon = proto.icon;
          return (
            <div
              key={proto.title}
              className="p-6 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-3.5"
            >
              <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border)]">
                <Icon className={`w-4 h-4 ${proto.color}`} />
                <h2 className="text-sm font-bold font-sans text-[var(--text-primary)]">
                  {proto.title}
                </h2>
              </div>

              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                {proto.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
