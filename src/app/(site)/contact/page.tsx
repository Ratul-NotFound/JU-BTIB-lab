import * as React from "react";
import Image from "next/image";
import { Metadata } from "next";
import { Clock, Mail } from "lucide-react";
import { getSiteSettings } from "@/server/queries/settings";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact & Institutional Location | BTIB Lab - Jahangirnagar University",
  description:
    "Get in touch with the Bioresources Technology and Industrial Biotechnology Laboratory at Jahangirnagar University, Savar, Dhaka-1342.",
};

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <section className="space-y-4 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.08]">
          Contact the <span className="text-[var(--brand-primary)]">Laboratory</span>
        </h1>

        <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-light">
          For academic thesis inquiries, postdoctoral fellowships, industrial biotechnology partnerships,
          or analytical sample characterization requests, please contact our research desk.
        </p>
      </section>

      {/* Main Grid: Form on left, Address & Institution on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Contact Form Column */}
        <div className="lg:col-span-7 p-8 sm:p-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
              Send an <span className="text-[var(--brand-primary)]">Academic Inquiry</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)] font-light">
              Direct communication with faculty investigators and lab coordination staff.
            </p>
          </div>

          <ContactForm />
        </div>

        {/* Institutional Coordinates Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 sm:p-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-6 shadow-xs">
            {/* Campus Header & University Logo */}
            <div className="flex items-center gap-3.5 pb-2 border-b border-[var(--border)]">
              <div className="relative w-10 h-10 shrink-0 flex items-center justify-center p-1 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]">
                <Image
                  src="/images/ju-logo.png"
                  alt="Jahangirnagar University Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain theme-invert-dark"
                />
              </div>
              <div>
                <h3 className="font-bold text-base text-[var(--text-primary)] leading-tight">
                  Jahangirnagar University
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Department of Biotechnology & Genetic Engineering
                </p>
              </div>
            </div>

            {/* Campus Image Header */}
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-[var(--border)]">
              <Image
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
                alt="Jahangirnagar University Campus grounds"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-xs text-white/95 font-medium flex items-center justify-between">
                <span>Jahangirnagar University Campus</span>
                <span className="text-[10px] font-mono opacity-80">Savar, Dhaka</span>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 relative shrink-0 p-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-center">
                  <Image
                    src="/images/btib-logo.png"
                    alt="BTIB"
                    width={28}
                    height={28}
                    className="w-full h-full object-contain theme-invert-dark"
                  />
                </div>
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-sm text-[var(--text-primary)] block">
                    Physical Facility Address
                  </span>
                  <p className="text-[var(--text-secondary)] leading-relaxed font-light">
                    {settings?.labName || "Bioresources Technology and Industrial Biotechnology Laboratory (BTIB Lab)"}
                    <br />
                    {settings?.departmentName || "Department of Biotechnology & Genetic Engineering"}
                    <br />
                    Faculty of Mathematical & Physical Sciences
                    <br />
                    {settings?.institutionName || "Jahangirnagar University"}, {settings?.address || "Savar, Dhaka-1342, Bangladesh"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[var(--bio-teal)]/10 text-[var(--bio-teal)] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-sm text-[var(--text-primary)] block">
                    Direct Correspondence Email
                  </span>
                  <a
                    href={`mailto:${settings?.contactEmail || "rahmanms@bgeju.edu.bd"}`}
                    className="font-mono text-[var(--bio-teal)] hover:underline block text-sm font-medium"
                  >
                    {settings?.contactEmail || "rahmanms@bgeju.edu.bd"}
                  </a>
                  <span className="text-[var(--text-muted)] font-light">
                    Official faculty desk & research inquiries
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--bio-teal)] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-sm text-[var(--text-primary)] block">
                    Operational Hours & Access
                  </span>
                  <p className="text-[var(--text-secondary)] font-light">
                    Sunday – Thursday: 09:00 – 17:00 BST
                    <br />
                    Friday – Saturday: Closed (Continuous automated bioreactor monitoring active)
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] text-xs text-[var(--text-muted)] leading-relaxed space-y-1">
              <strong className="text-[var(--text-primary)] block">
                Visiting & Security Protocol
              </strong>
              <p className="font-light">
                External researchers, prospective students, and industry collaborators should schedule appointments in advance via email prior to visiting the BGE department research suites.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
